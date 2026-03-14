/**
 * deleteExpense
 * -------------
 * Soft deletes an expense by setting `deletedAt`.
 *
 * Rules:
 * - Only expense creator can delete
 * - Expense is NOT removed from DB
 * - Financial impact will be handled separately (balance reversal)
 *
 * NOTE:
 * - This function only marks expense as deleted
 * - Balance / ledger reversal will be added later
 */

const Expense = require("../../models/expense.model");

const deleteExpense = async ({ expenseId, userId }) => {
  //  Find expense
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  //  Only creator can delete the expense
  if (expense.createdBy.toString() !== userId.toString()) {
    const error = new Error("You are not allowed to delete this expense");
    error.statusCode = 403;
    throw error;
  }

  //  Prevent double delete
  if (expense.deletedAt) {
    const error = new Error("Expense already deleted");
    error.statusCode = 400;
    throw error;
  }

  //  Soft delete (no DB removal)
  expense.deletedAt = new Date();
  expense.deletedBy = userId;

  await expense.save();

  return {
    success: true,
    message: "Expense deleted successfully",
    expenseId: expense._id,
    groupId: expense.groupId,
  };
};

module.exports = { deleteExpense };