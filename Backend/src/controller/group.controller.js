const Group = require("../models/group.model");
const Expense = require("../models/expense.model");
const Settlement = require("../models/settlement.model");

const { getIO } = require("../sockets/socketManager");
const createNotification = require("../services/notification/createNotification");
const crypto = require("crypto");

const {
  getGroupTotalSpent,
  getUserNetBalance,
} = require("../services/groups.service");
const calculateTotalSpent = require("../services/calculation/calculateTotalSpent");
const calculateUserPaid = require("../services/calculation/calculateUserPaid");
const calculateUserShare = require("../services/calculation/calculateUserShare");
const buildPayList = require("../services/calculation/buildPayList");
const buildReceiveList = require("../services/calculation/buildReceiveList");

/* 
   Utility: Generate random invite code for groups
 */
const generateInviteCode = () => {
  return crypto.randomBytes(4).toString("hex");
};

/* 
   Create Group
 */
const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const createdBy = req.user._id;

    if (!createdBy) {
      return res.status(400).json({
        success: false,
        message: "creator userId required",
      });
    }

    // Generate unique invite code
    let inviteCode;

    for (let i = 0; i < 5; i++) {
      inviteCode = generateInviteCode();
      const exists = await Group.findOne({ inviteCode });
      if (!exists) break;
    }

    const group = await Group.create({
      name,
      createdBy,
      admin:createdBy,
      members: [
        {
          userId: createdBy,
        },
      ],
      inviteCode,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: group._id,
        name: group.name,
        inviteCode: group.inviteCode,
        admin:group.admin
      },
    });
  } catch (error) {
    console.error("Create group error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create group",
    });
  }
};

// Get all the group

const getAllgroup = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({
      "members.userId": userId,
      isArchived: false,
    })
      .select("name members lastExpense createdBy") // only required fields
      .populate("members.userId", "name email avatar")
      .populate("createdBy", "name email")
      .lean(); // IMPORTANT

    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (err) {
    console.error("Fetch groups error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
};
/*
   Get single group by ID */
const getGroupbyId = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Access control
    const group = await Group.findOne({
      _id: groupId,
      "members.userId": userId,
      isArchived: false,
    })
      .populate("members.userId", "name email avatar")
      .populate("createdBy", "name email")
      .lean();

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found or access denied",
      });
    }

    // Fetch expenses & settlements once
    const [expenses, settlements] = await Promise.all([
      Expense.find({
        groupId,
        deletedAt: null,
      })
        .select("amount paidBy splitType splits")
        .lean(),

      Settlement.find({
        groupId,
      })
        .select("from to amount")
        .lean(),
    ]);

    // Members
    const members = group.members.map((m) => m.userId);

    // Calculations (same functions)
    const totalSpent = calculateTotalSpent(expenses);

    const userPaid = calculateUserPaid(
      expenses.filter((e) => e.paidBy.toString() === userId.toString())
    );

    const userShare = calculateUserShare(expenses, userId);

    const payList = buildPayList(expenses, settlements, members, userId);

    const receiveList = buildReceiveList(expenses, settlements, members, userId);

    const expenseCount = expenses.length;

    const totalOwed = payList.reduce((sum, p) => sum + p.amount, 0);
    const totalReceive = receiveList.reduce((sum, r) => sum + r.amount, 0);
    const netBalance = totalReceive - totalOwed;

    return res.status(200).json({
      success: true,
      data: {
        ...group,
        totalSpent,
        userPaid,
        userShare,
        netBalance,
        payList,
        receiveList,
        expenseCount,
      },
    });

  } catch (err) {
    console.error("Get group by id error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch group",
    });
  }
};

const CheckInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: group._id,
        name: group.name,
        membersCount: group.members.length,
      },
    });
  } catch (err) {
    console.error("Invite check error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* Join Group using invite code */
const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const userId = req.user._id; // P1: consistent _id

    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link",
      });
    }

    // P3: Atomic check-and-add — prevents duplicate member entry on parallel requests
    const updateResult = await Group.updateOne(
      { _id: group._id, "members.userId": { $ne: userId } },
      { $push: { members: { userId } } }
    );

    const wasAlreadyMember = updateResult.modifiedCount === 0;

    if (wasAlreadyMember) {
      // Already a member — return populated group as success (idempotent)
      const existingGroup = await Group.findById(group._id).populate(
        "members.userId",
        "name email avatar"
      );
      return res.json({ success: true, data: existingGroup });
    }

    // New member added — emit socket event
    const io = getIO();
    io.to(group._id.toString()).emit("member-joined", {
      groupId: group._id,
      user: {
        _id: req.user._id,
        name: req.user.name,
      },
      createdAt: new Date(),
    });

    // Collect existing member IDs (before new member joined)
    const existingMemberIds = group.members
      .map((m) => m.userId.toString())
      .filter((id) => id !== userId.toString());

    // P2: Notification in isolated try-catch — failure won't block join success
    if (existingMemberIds.length > 0) {
      try {
        await createNotification({
          userIds: existingMemberIds,
          title: "New Member Joined",
          message: `${req.user.name} just joined the group ${group.name}`,
          type: "group",
          metadata: { groupId: group._id },
        });
      } catch (notifErr) {
        console.error("Notification failed (non-critical):", notifErr);
        // Swallow — notification failure must not fail the join response
      }
    }

    // Populate before sending response
    const populatedGroup = await Group.findById(group._id).populate(
      "members.userId",
      "name email avatar"
    );

    return res.json({
      success: true,
      data: populatedGroup,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Join failed",
    });
  }
};

// Leave Group
const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const userName = req.user.name;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if user is member
    const isMember = group.members.some(
      (m) => m.userId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    // ── Balance check using same logic as UI (buildPayList / buildReceiveList) ──
    const [expenses, settlements] = await Promise.all([
      Expense.find({ groupId, deletedAt: null })
        .select("amount paidBy splitType splits")
        .lean(),
      Settlement.find({ groupId })
        .select("from to amount")
        .lean(),
    ]);

    // Populate members for buildPayList/buildReceiveList
    const populatedGroup = await Group.findById(groupId)
      .select("members")
      .populate("members.userId", "name")
      .lean();

    const members = populatedGroup.members.map((m) => m.userId);

    const payList     = buildPayList(expenses, settlements, members, userId);
    const receiveList = buildReceiveList(expenses, settlements, members, userId);

    const totalOwed    = payList.reduce((sum, p) => sum + p.amount, 0);
    const totalReceive = receiveList.reduce((sum, r) => sum + r.amount, 0);

    // Use same 0.01 tolerance as before to guard against floating-point dust
    if (totalOwed > 0.01 || totalReceive > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Please settle all balances before leaving the group",
      });
    }

    const io = getIO();

    // Check if admin
    const isAdmin = group.admin.toString() === userId.toString();

    // Remaining members
    const remainingMembers = group.members.filter(
      (m) => m.userId.toString() !== userId.toString()
    );

    // Last member leaving — archive the orphan group
    if (remainingMembers.length === 0) {
      group.isArchived = true;
    } else if (isAdmin) {
      // Admin transfer: pick longest-standing remaining member
      remainingMembers.sort(
        (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt)
      );

      group.admin = remainingMembers[0].userId;

      io.to(groupId).emit("admin-changed", {
        groupId,
        adminId: group.admin,
      });
    }

    // Remove member
    group.members = remainingMembers;

    // Activity log
    group.activities.push({
      type: "GROUP_LEAVE",
      userId,
      userName,
    });

    await group.save();

    // Notify members
    io.to(groupId).emit("member-left", {
      groupId,
      user: {
        _id: req.user._id,
        name: userName,
      },
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "You left the group successfully",
    });

  } catch (error) {
    console.error("Leave group error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to leave group",
    });
  }
};

module.exports = {
  createGroup,
  getAllgroup,
  getGroupbyId,
  CheckInviteCode,
  joinGroup,
  leaveGroup,
};
