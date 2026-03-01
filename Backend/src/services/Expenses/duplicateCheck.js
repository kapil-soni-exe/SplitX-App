const Expense = require("../../models/expense.model");

const DUPLICATE_WINDOW_MS = 10 * 1000;

async function checkDuplicateExpense({
  groupId,
  amount,
  paidBy,
  expenseDate,
  userId,
}) {
  const fromTime = new Date(Date.now() - DUPLICATE_WINDOW_MS);

  return Expense.findOne({
    groupId,
    amount,
    paidBy,
    expenseDate,
    createdBy: userId,
    deletedAt: null,
    createdAt: { $gte: fromTime },
  });
}

module.exports = { checkDuplicateExpense };