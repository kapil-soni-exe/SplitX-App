const Expense = require("../models/expense.model");
const Group = require("../models/group.model")
const User = require("../models/users.model")
const { calculateEqualSplit,calculateExactSplit } = require("../../utils/splitCalculator")

const createExpense = async (data, user) => {
  const { splitType, amount, splitBetween, splits, paidBy,groupId } = data;

  let finalSplits = [];

  if (splitType === "EQUAL") {
    finalSplits = calculateEqualSplit({ amount, splitBetween, paidBy });
  }

  if (splitType === "EXACT") {
    finalSplits = calculateExactSplit({ amount, splits, paidBy });
  }

  //  Expense create
  const expense = await Expense.create({
    ...data,
    splits: finalSplits,
    createdBy: user._id,
  });

  const paidByUser = await User.findById(expense.paidBy).select("name");
 
 // Update Group Last Expense (FIXED)
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

module.exports = { createExpense };