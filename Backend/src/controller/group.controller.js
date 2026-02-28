const Group = require("../models/group.model");
const crypto = require("crypto");
const {
  getGroupTotalSpent,
  getUserPaid,
  getUserShare,
  getPayList,
  getReceiveList,
  getExpensesCount,
} = require("../services/groups.service");

//Create Group
const generateInviteCode = () => {
  return crypto.randomBytes(4).toString("hex");
};

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
    //  Generate Invite Code
    let inviteCode;
    for (let i = 0; i < 5; i++) {
      inviteCode = generateInviteCode();
      const exists = await Group.findOne({ inviteCode });
      if (!exists) break;
    }
    const group = await Group.create({
      name,
      createdBy,
      members: [createdBy],
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

// Fetch Group
const getAllgroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({
      members: userId,
      isArchived: false,
    })
      .populate("members", "name email avatar")
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

// Get Group by id

const getGroupbyId = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    //  find group where:
    // - id matches
    // - user is member
    // - group not archived

    const group = await Group.findOne({
      _id: groupId,
      members: userId,
      isArchived: false,
    })
      .populate("members", "name email avatar")
      .populate("createdBy", "name email")
      .lean();

    //  access control
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found or access denied",
      });
    }

    const [totalSpent, userPaid, userShare, payList, receiveList,expenseCount] =
      await Promise.all([
        getGroupTotalSpent(group._id),
        getUserPaid(group._id, userId),
        getUserShare(group._id, userId),
        getPayList(group._id, userId),
        getReceiveList(group._id, userId),
        getExpensesCount(group._id)
      ]);

    const netBalance = userPaid - userShare;

    

    // success response
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
        expenseCount
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

// Check Invite Code
const CheckInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    //group find by inviteCode
    const group = await Group.findOne({ inviteCode });

    // If Group not Exists
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link",
      });
    }

    // If Group found
    return res.status(200).json({
      success: true,
      data: {
        _id: group._id,
        name: group.name,
        membersCount: group.members.length,
      },
    });
  } catch (err) {
    console.error("Invite check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Join Group From ID
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

    // already member → just return group
    if (group.members.some((m) => m.toString() === userId)) {
      return res.json({
        success: true,
        data: group,
      });
    }

    group.members.push(userId);
    await group.save();

    

    return res.json({
      success: true,
      data: group,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Join failed",
    });
  }
};

module.exports = {
  createGroup,
  getAllgroup,
  getGroupbyId,
  CheckInviteCode,
  joinGroup,
};
