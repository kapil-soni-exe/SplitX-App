const Expense = require("../models/expense.model");
const expenseService = require("../services/expense.service");
// Create Expenses
const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body, req.user);
    return res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create expense",
    });
  }
};

// Get expenses by group
const getExpensesByGroup = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: "groupId is required",
      });
    }

    const expenses = await Expense.find({
      groupId,
      deletedAt: null,
    })
      .populate("paidBy", "name")
      .populate("splits.userId", "name")
      .sort({ expenseDate: -1, createdAt: -1 });
    console.log(
      expenses.map((e) => ({
        paidBy: e.paidBy,
        splits: e.splits,
      })),
    );

    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};
module.exports = { createExpense, getExpensesByGroup };
