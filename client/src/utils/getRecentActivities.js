export function getRecentActivities(groups) {
  const activities = [];

  groups.forEach((group) => {
    group.expenses.forEach((expense) => {
      const payer = group.members.find(
        (m) => m.id === expense.paidBy
      );

      activities.push({
         id: `activity-${expense.id}`,

        name: payer.name,
        title: expense.title,
        groupName: group.name,
        amount: expense.amount,

        createdAt: expense.createdAt,
      });
    });
  });

  return activities.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}
