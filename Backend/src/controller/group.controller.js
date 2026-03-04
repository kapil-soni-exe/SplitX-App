const Group = require("../models/group.model");
const crypto = require("crypto");

const {
  getGroupTotalSpent,
  getUserPaid,
  getUserShare,
  getPayList,
  getReceiveList,
  getExpensesCount,
  getUserNetBalance,
} = require("../services/groups.service");

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

    const createdBy = req.user.id;

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

/* 
   Fetch all groups where user is a member
 */
const getAllgroup = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({
      "members.userId": userId,
      isArchived: false,
    })
      // Populate user details inside members.userId
      .populate("members.userId", "name email avatar")
      .populate("createdBy", "name email");

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
    const userId = req.user.id;

    // Access control:
    // user must be member of the group
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

    // Fetch financial summary in parallel
    const [
      totalSpent,
      userPaid,
      userShare,
      payList,
      receiveList,
      expenseCount,
    ] = await Promise.all([
      getGroupTotalSpent(group._id),
      getUserPaid(group._id, userId),
      getUserShare(group._id, userId),
      getPayList(group._id, userId),
      getReceiveList(group._id, userId),
      getExpensesCount(group._id),
    ]);

    let netBalance = 0;

    if (payList.length > 0) {
      netBalance = -payList.reduce((sum, p) => sum + p.amount, 0);
    }

    if (receiveList.length > 0) {
      netBalance = receiveList.reduce((sum, r) => sum + r.amount, 0);
    }

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
    const userId = req.user.id;

    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link",
      });
    }

    // Check if user already exists in members list
    const alreadyMember = group.members.some(
      (m) => m.userId.toString() === userId.toString(),
    );

    if (alreadyMember) {
      return res.json({
        success: true,
        data: group,
      });
    }

    // Add new member with joinedAt timestamp
    group.members.push({
      userId,
    });

    await group.save();

    // Populate before sending response
    const populatedGroup = await Group.findById(group._id).populate(
      "members.userId",
      "name email avatar",
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
    const userId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if user is member
    const isMember = group.members.some((m) => m.userId.toString() === userId);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    // Check if user balance is settled
    const balance = await getUserNetBalance(groupId, userId);
    console.log("User balance:", balance);

    if (balance !== 0) {
      return res.status(400).json({
        success: false,
        message: "Please settle all balances before leaving the group",
      });
    }

    // Remove member from group
    group.members = group.members.filter((m) => m.userId.toString() !== userId);

    // Add activity
    group.activities.push({
      type: "GROUP_LEAVE",
      userId,
      userName,
    });

    await group.save();

    return res.status(200).json({
      success: true,
      message: "You left the group successfully",
    });
  } catch (error) {
    console.error("Leave group error:", error);

    res.status(500).json({
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
