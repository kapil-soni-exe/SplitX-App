const Expense = require("../../models/expense.model");

const editExpense = async ({ expenseId, data, userId }) => {
  //  Find expense
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  //  Only creator can edit
  if (expense.createdBy.toString() !== userId.toString()) {
    const error = new Error("You are not allowed to edit this expense");
    error.statusCode = 403;
    throw error;
  }

  //  Validate splits vs amount
  if (data.splits && data.amount) {
    const totalSplit = data.splits.reduce(
      (sum, s) => sum + Number(s.amount || 0),
      0
    );

    if (totalSplit !== Number(data.amount)) {
      const error = new Error("Split total must be equal to amount");
      error.statusCode = 400;
      throw error;
    }
  }

  //  Allowed updates
  if (data.title !== undefined) expense.title = data.title;
  if (data.amount !== undefined) expense.amount = data.amount;
  if (data.note !== undefined) expense.note = data.note;
  if (data.paidBy !== undefined) expense.paidBy = data.paidBy;
  if (data.splits !== undefined) expense.splits = data.splits;
  if (data.splitType !== undefined) expense.splitType = data.splitType;
  if (data.expenseDate !== undefined) expense.expenseDate = data.expenseDate;
  
    //  MARK AS EDITED (
  expense.editedAt = new Date();

  await expense.save();

  // Return populated expense 
  const updatedExpense = await Expense.findById(expense._id)
    .populate("paidBy", "name")
    .populate("splits.userId", "name");

  return updatedExpense;
};

module.exports = { editExpense };