const Expense = require("../models/expense.model");
const { calculateEqualSplit,calculateExactSplit } = require("../../utils/splitCalculator")

const createExpense = async (data, user) => {
  const { splitType, amount, splitBetween, splits, paidBy } = data;

  let finalSplits = [];

  if (splitType === "EQUAL") {
    finalSplits = calculateEqualSplit({ amount, splitBetween, paidBy });
  }

  if (splitType === "EXACT") {
    finalSplits = calculateExactSplit({ amount, splits, paidBy });
  }

  return Expense.create({
    ...data,
    splits: finalSplits,
    createdBy: user._id,
  });
};

module.exports = { createExpense };