export function getRecentActivities(groups = []) {
  if (!Array.isArray(groups)) return [];

  const activities = [];

  groups.forEach((group) => {
    if (!Array.isArray(group.expenses)) return;

    group.expenses.forEach((expense) => {
      const payer = group.members?.find(
        (m) =>
          m._id?.toString() === expense.paidBy?.toString()
      );

      activities.push({
        id: `activity-${expense._id}`,

        name: payer?.name || "Someone",
        title: expense.title,
        groupName: group.name,
        amount: expense.amount,

        createdAt: expense.createdAt,
      });
    });
  });

  return activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10); // 🔥 limit for dashboard
}