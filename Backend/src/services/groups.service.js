const Expense = require("../models/expense.model");
const Group = require("../models/group.model");

const calculateTotalSpent = require("./calculation/calculateTotalSpent");
const calculateUserPaid = require("./calculation/calculateUserPaid");
const calculateUserShare = require("./calculation/calculateUserShare");
const calculateNetBalance = require("./calculation/calculateNetBalance");
const buildPayList = require("./calculation/buildPayList");
const buildReceiveList = require("./calculation/buildReceiveList");

// ------------------------------
// Get Group Total
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
    const [paid, share] = await Promise.all([
      getUserPaid(groupId, userId),
      getUserShare(groupId, userId),
    ]);

    return calculateNetBalance(paid, share);
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
    const [expenses, group] = await Promise.all([
      Expense.find({
        groupId,
        deletedAt: null,
      })
        .select("amount paidBy splitType splits")
        .lean(),

      Group.findById(groupId)
        .select("members")
        .populate("members", "name")
        .lean(),
    ]);

    if (!group || !Array.isArray(group.members)) return [];

    return buildPayList(expenses, group.members, currentUserId);
  } catch (err) {
    console.error("Error building pay list:", err);
    return [];
  }
}

// Get Receive List
async function getReceiveList(groupId, currentUserId) {
  try {
    const [expenses, group] = await Promise.all([
      Expense.find({ groupId, deletedAt: null })
        .select("amount paidBy splitType splits")
        .lean(),

      Group.findById(groupId)
        .select("members")
        .populate("members", "name")
        .lean(),
    ]);

    if (!group) return [];

    return buildReceiveList(expenses, group.members, currentUserId);
  } catch (err) {
    console.error("Error building receive list:", err);
    return [];
  }
}


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
  getExpensesCount
};