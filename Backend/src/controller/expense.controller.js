const Expense = require("../models/expense.model");
const expenseService = require("../services/Expenses/index");
const { editExpense } = require("../services/Expenses/editExpense");
const { deleteExpense } = require("../services/Expenses/deleteExpense");
const { getIO } = require("../sockets/socketManager");
// Create Expenses
const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body, req.user);
    const io = getIO();

    io.to(expense.groupId.toString()).emit("expense-added", expense);
    return res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
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

// Update Expenses

const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user._id;
    const data = req.body;

    const updatedExpense = await editExpense({
      expenseId,
      data,
      userId,
    });

    const io = getIO();
    io.to(updatedExpense.groupId.toString()).emit(
      "expense-updated",
      updatedExpense,
    );

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Something went wrong",
    });
  }
};

/**
 * deleteExpenseController
 * ----------------------
 * Handles HTTP request for deleting an expense.
 *
 * Flow:
 * - Auth user
 * - Call deleteExpense service
 * - Return success / error response
 *

 */

const deleteExpenseController = async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user?.id;

  try {
    const result = await deleteExpense({ expenseId, userId });

    const io = getIO();
 
  io.to(result.groupId.toString()).emit("expense-deleted", {
    
  expenseId: result.expenseId,
  deletedBy: {
    _id: req.user._id,
    name: req.user.name
  }
  
});

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something went wrong while deleting expense",
    });
  }
};

module.exports = {
  createExpense,
  getExpensesByGroup,
  updateExpense,
  deleteExpenseController,
};
