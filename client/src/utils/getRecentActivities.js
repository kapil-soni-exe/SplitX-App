export function getRecentActivities(groups = []) {
  return groups
    .filter(g => g.lastExpense)
    .map(g => ({
      id: g.lastExpense.expenseId,
      name: g.lastExpense.createdBy?.name || "Someone",
      title: g.lastExpense.title,
      groupName: g.name,
      amount: g.lastExpense.amount,
      createdAt: g.lastExpense.createdAt
    }))
    .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0,10);
}