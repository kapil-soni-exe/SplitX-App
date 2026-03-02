const Expense = require("../../models/expense.model");
const Group = require("../../models/group.model");

const getExpensesByGroup = async (groupId, user) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw Object.assign(new Error("Group not found"), { statusCode: 404 });
  }

  const isMember = group.members.some(
    (m) => m.toString() === user._id.toString()
  );

  if (!isMember) {
    throw Object.assign(new Error("Access denied"), { statusCode: 403 });
  }

  const expenses = await Expense.find({
    groupId,
  })
    .populate("paidBy", "name")
    .populate("splits.userId", "name")
    .populate("deletedBy", "name")
     .populate("createdBy", "name")
    .sort({ expenseDate: -1, createdAt: -1 });

  return expenses;
};

module.exports = getExpensesByGroup;