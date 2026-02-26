export function activityFormatter(expense, group, currentUser) {
  if (!expense || !currentUser) return "";

  const isOutgoing =
    expense.paidBy?._id?.toString() === currentUser?._id?.toString();

  const name = isOutgoing
    ? "You"
    : expense.paidBy?.name || "Someone";

  return `${name} added ₹${expense.amount} for ${expense.title}`;
}