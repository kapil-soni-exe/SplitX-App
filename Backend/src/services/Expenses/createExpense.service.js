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

  // SAME validation (shifted)
  await validateGroupAndMembers({ groupId, splitBetween, paidBy });

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

  const paidByUser = await User.findById(expense.paidBy).select("name");

  await Group.findByIdAndUpdate(groupId, {
    lastExpense: {
      expenseId: expense._id,
      title: expense.title,
      amount: expense.amount,
      paidBy: {
        _id: paidByUser._id,
        name: paidByUser.name,
      },
      createdBy: {
        _id: user._id,
        name: user.name,
      },
      createdAt: expense.createdAt,
    },
  });

  return expense;
};

module.exports = createExpense;