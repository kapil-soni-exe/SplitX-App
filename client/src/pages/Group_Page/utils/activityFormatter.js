export function activityFormatter(expense, userId) {
  if (!expense || expense.deletedAt) {
    return "";
  }

  const creatorId =
    typeof expense.createdBy === "string"
      ? expense.createdBy
      : expense.createdBy?._id?.toString();

  const isMe = creatorId === userId?.toString();

  const name = isMe
    ? "You"
    : expense.createdBy?.name || "Someone";

  return `${name} added ₹${expense.amount} for ${expense.title}`;
}