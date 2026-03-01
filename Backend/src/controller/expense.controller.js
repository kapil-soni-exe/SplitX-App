const Expense = require("../models/expense.model");
const expenseService = require("../services/Expenses/index");
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
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create expense",
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

    const expenses = await expenseService.getExpensesByGroup(groupId, req.user);

    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch expenses",
    });
  }
};
module.exports = { createExpense, getExpensesByGroup };
