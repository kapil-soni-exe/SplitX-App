export function activityFormatter(expense, userId) {
  const paidById =
    typeof expense.paidBy === "string"
      ? expense.paidBy
      : expense.paidBy?._id?.toString();

  const isMe = paidById === userId;

  const name = isMe
    ? "You"
    : expense.paidBy?.name || "Someone";

  return `${name} added ₹${expense.amount} for ${expense.title}`;
}