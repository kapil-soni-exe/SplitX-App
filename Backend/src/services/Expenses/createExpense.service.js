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

  // Notification for Group Members
  const targetGroup = await Group.findById(groupId).select("members").lean();
  if (targetGroup && targetGroup.members) {
    const notifyIds = targetGroup.members
      .map((m) => m.userId.toString())
      .filter((id) => id !== user._id.toString()); // don't notify the person who added it

    if (notifyIds.length > 0) {
      const createNotification = require("../notification/createNotification");
      await createNotification({
        userIds: notifyIds,
        title: "New Expense Added",
        message: `${user.name} added "${populatedExpense.title}" (₹${populatedExpense.amount}) in your group.`,
        type: "expense",
        metadata: { groupId, expenseId: populatedExpense._id }
      });
    }
  }

  return populatedExpense;
};

module.exports = createExpense;