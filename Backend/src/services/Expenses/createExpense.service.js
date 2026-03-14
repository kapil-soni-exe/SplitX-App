const Expense = require("../../models/expense.model");
const User = require("../../models/users.model");
const Group = require("../../models/group.model");
const {
  calculateEqualSplit,
  calculateExactSplit,
} = require("../../../utils/splitCalculator");

const { validateGroupAndMembers } = require("../Expenses/validators");

const createExpense = async (data, user) => {
  const { splitType, amount, splitBetween, splits, paidBy, groupId } = data;

  const membersToValidate =
  splitType === "EXACT"
    ? splits.map((s) => s.userId)
    : splitBetween;

  // SAME validation (shifted)
  await validateGroupAndMembers({ groupId, splitBetween:membersToValidate, paidBy });

  let finalSplits = [];

  if (splitType === "EQUAL") {
    finalSplits = calculateEqualSplit({
      amount,
      splitBetween,
      paidBy,
    });
  }

  if (splitType === "EXACT") {
    finalSplits = calculateExactSplit({
      amount,
      splits,
      paidBy,
    });
  }

  const expense = await Expense.create({
    ...data,
    splits: finalSplits,
    createdBy: user._id,
  });

  const populatedExpense = await Expense.findById(expense._id)
  .populate("paidBy", "name")
  .populate("createdBy", "name")
  .populate("splits.userId", "name");

  await Group.findByIdAndUpdate(groupId, {
  lastExpense: {
    expenseId: populatedExpense._id,
    title: populatedExpense.title,
    amount: populatedExpense.amount,
    paidBy: {
      _id: populatedExpense.paidBy._id,
      name: populatedExpense.paidBy.name,
    },
    createdBy: {
      _id: user._id,
      name: user.name,
    },
    createdAt: populatedExpense.createdAt,
  },
});


  return populatedExpense;
};

module.exports = createExpense;