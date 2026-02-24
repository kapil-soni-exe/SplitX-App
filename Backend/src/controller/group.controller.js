const Group = require("../models/group.model");
const crypto = require("crypto");

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
      .populate("createdBy", "name email");

    //  access control
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found or access denied",
      });
    }

    // success response
    return res.status(200).json({
      success: true,
      data: group,
    });
  } catch (err) {
    console.error("Get group by id error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch group",
    });
  }
};

module.exports = {
  createGroup,
  getAllgroup,
  getGroupbyId,
};
