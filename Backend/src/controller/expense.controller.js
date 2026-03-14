const expenseService = require("../services/Expenses/index");
const { editExpense } = require("../services/Expenses/editExpense");
const { deleteExpense } = require("../services/Expenses/deleteExpense");
const { getIO } = require("../sockets/socketManager");
const Group = require("../models/group.model");
const createNotification = require("../services/notification/createNotification");


// Create Expenses
const createExpense = async (req, res) => {
  try {

    const expense = await expenseService.createExpense(req.body, req.user);

    const io = getIO();
    io.to(expense.groupId.toString()).emit("expense-added", expense);

    // get group
    const group = await Group.findById(expense.groupId);

    const memberIds = group.members.map(m => m.userId);

    const recipients = memberIds.filter(
      id => id.toString() !== req.user._id.toString()
    );

    // create notifications
    await createNotification({
      userIds: recipients,
      title: "New Expense Added",
      message: `${req.user.name} added ₹${expense.amount} for ${expense.title}`,
      type: "expense",
      metadata: {
        expenseId: expense._id,
        groupId: expense.groupId
      }
    });

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

    // get group
    const group = await Group.findById(updatedExpense.groupId);

    const memberIds = group.members.map(m => m.userId);

    const recipients = memberIds.filter(
      id => id.toString() !== req.user._id.toString()
    );

    // notification
    await createNotification({
      userIds: recipients,
      title: "Expense Updated",
      message: `${req.user.name} updated ${updatedExpense.title}`,
      type: "expense",
      metadata: {
        expenseId: updatedExpense._id,
        groupId: updatedExpense.groupId
      }
    });

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

    // get group
    const group = await Group.findById(result.groupId);

    const memberIds = group.members.map(m => m.userId);

    const recipients = memberIds.filter(
      id => id.toString() !== req.user._id.toString()
    );

    // notification
    await createNotification({
      userIds: recipients,
      title: "Expense Deleted",
      message: `${req.user.name} deleted an expense`,
      type: "expense",
      metadata: {
        expenseId: result.expenseId,
        groupId: result.groupId
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