const Expense = require("../models/expense.model");
const Group = require("../models/group.model");
const Settlement = require("../models/settlement.model");

const calculateTotalSpent = require("./calculation/calculateTotalSpent");
const calculateUserPaid = require("./calculation/calculateUserPaid");
const calculateUserShare = require("./calculation/calculateUserShare");
const calculateNetBalance = require("./calculation/calculateNetBalance");
const buildPayList = require("./calculation/buildPayList");
const buildReceiveList = require("./calculation/buildReceiveList");


// ------------------------------
// Get Group Total Spent
// ------------------------------
async function getGroupTotalSpent(groupId) {
  try {
    const expenses = await Expense.find({
      groupId,
      deletedAt: null,
    })
      .select("amount")
      .lean();

    return calculateTotalSpent(expenses);
  } catch (error) {
    console.error("Error calculating group total spent:", error);
    return 0;
  }
}


// ------------------------------
// Get User Paid
// ------------------------------
async function getUserPaid(groupId, userId) {
  try {
    const expenses = await Expense.find({
      groupId,
      paidBy: userId,
      deletedAt: null,
    })
      .select("amount")
      .lean();

    return calculateUserPaid(expenses);
  } catch (err) {
    console.error("Error calculating user paid:", err);
    return 0;
  }
}


// ------------------------------
// Get User Share
// ------------------------------
async function getUserShare(groupId, userId) {
  try {
    const expenses = await Expense.find({
      groupId,
      deletedAt: null,
    })
      .select("amount splitType splits")
      .lean();

    return calculateUserShare(expenses, userId);
  } catch (err) {
    console.error("Error calculating user share:", err);
    return 0;
  }
}


// ------------------------------
// Get User Net Balance
// ------------------------------
async function getUserNetBalance(groupId, userId) {
  try {
    const [paid, share, settlements] = await Promise.all([
      getUserPaid(groupId, userId),
      getUserShare(groupId, userId),
      Settlement.find({ groupId })
        .select("from to amount")
        .lean(),
    ]);

    let net = calculateNetBalance(paid, share);

    settlements.forEach((s) => {
      const amount = Number(s.amount);

      if (s.from.toString() === userId.toString()) {
        net += amount; // user paid settlement
      }

      if (s.to.toString() === userId.toString()) {
        net -= amount; // user received settlement
      }
    });

    return Number(net.toFixed(2));
  } catch (err) {
    console.error("Error calculating net balance:", err);
    return 0;
  }
}

// ------------------------------
// Get Pay List
// ------------------------------
async function getPayList(groupId, currentUserId) {
  try {

    const [expenses, settlements, group] = await Promise.all([

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

      // Populate nested userId inside members
      Group.findById(groupId)
        .select("members")
        .populate("members.userId", "name")
        .lean(),
    ]);

    if (!group || !Array.isArray(group.members)) return [];

    /**
     * Flatten members
     * Convert:
     * [{ userId, joinedAt }]
     * →
     * [{ _id, name }]
     */
    const members = group.members.map((m) => m.userId);

    return buildPayList(expenses, settlements, members, currentUserId);

  } catch (err) {
    console.error("Error building pay list:", err);
    return [];
  }
}


// ------------------------------
// Get Receive List
// ------------------------------
async function getReceiveList(groupId, currentUserId) {
  try {

    const [expenses, settlements, group] = await Promise.all([

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

      Group.findById(groupId)
        .select("members")
        .populate("members.userId", "name")
        .lean(),
    ]);

    if (!group) return [];

    // Flatten members
    const members = group.members.map((m) => m.userId);

    return buildReceiveList(expenses, settlements, members, currentUserId);

  } catch (err) {
    console.error("Error building receive list:", err);
    return [];
  }
}


// ------------------------------
// Get Expenses Count
// ------------------------------
async function getExpensesCount(groupId) {
  try {

    const count = await Expense.countDocuments({
      groupId,
      deletedAt: null,
    });

    return count;

  } catch (err) {
    console.error("Error counting expenses:", err);
    return 0;
  }
}


module.exports = {
  getGroupTotalSpent,
  getUserPaid,
  getUserShare,
  getUserNetBalance,
  getPayList,
  getReceiveList,
  getExpensesCount,
};