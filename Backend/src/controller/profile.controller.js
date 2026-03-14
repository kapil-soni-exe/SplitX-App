const Group = require("../models/group.model");
const Expense = require("../models/expense.model");
const Settlement = require("../models/settlement.model");
const User = require("../models/users.model")

const getProfileStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const groupsCount = await Group.countDocuments({
      "members.userId": userId,
      isArchived: false,
    });

    const expensesCount = await Expense.countDocuments({
      createdBy: userId,
      deletedAt: null,
    });
    console.log("Expenses Count:", expensesCount);
    const settlementsCount = await Settlement.countDocuments({
      $or: [{ from: userId }, { to: userId }],
    });

    res.json({
      groups: groupsCount,
      expenses: expensesCount,
      settlements: settlementsCount,
    });
  } catch {
    res.status(500).json({
      message: "Failed to load profile stats",
    });
  }
};

// Edit Profile

const updateProfile = async (req, res) => {
  try {

    const userId = req.user._id;

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true }
    ).select("-password");

    res.json({
      user: updatedUser
    });

  } catch (err) {

    res.status(500).json({
      success:true,
      message: "Update failed"
    });

  }
};

module.exports = {
  getProfileStats,
  updateProfile
};
