const Expense = require("../models/expense.model");
const expenseService = require("../services/Expenses/index");
const {editExpense} = require("../services/Expenses/editExpense")
const {deleteExpense} = require("../services/Expenses/deleteExpense")
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

// Update Expenses

const updateExpense = async (req, res) => {
  console.log("🔹 [UPDATE EXPENSE] API HIT");

  try {
    const { expenseId } = req.params;
    const userId = req.user._id;
    const data = req.body;

    console.log("➡️ expenseId:", expenseId);
    console.log("➡️ userId:", userId.toString());
    console.log("➡️ payload:", JSON.stringify(data, null, 2));

    const updatedExpense = await editExpense({
      expenseId,
      data,
      userId,
    });

    console.log("✅ Expense updated successfully:", updatedExpense._id);

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (err) {
    console.error("❌ Error while updating expense");
    console.error("❌ Message:", err.message);
    console.error("❌ Stack:", err.stack);

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
 * NOTE:
 * - Errors are handled locally
 * - Console logs added for debugging
 */

const deleteExpenseController = async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user?.id;

  console.log("[DELETE EXPENSE] Request received");
  console.log("[DELETE EXPENSE] expenseId:", expenseId);
  console.log("[DELETE EXPENSE] userId:", userId);

  try {
    const result = await deleteExpense({ expenseId, userId });

    console.log("[DELETE EXPENSE] Success:", result);

    return res.status(200).json(result);
  } catch (err) {
    console.error("[DELETE EXPENSE] Failed", {
      message: err.message,
      statusCode: err.statusCode,
      expenseId,
      userId,
    });

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something went wrong while deleting expense",
    });
  }
};


module.exports = { createExpense, getExpensesByGroup,updateExpense,deleteExpenseController };
