function calculateUserPaid(expenses = []) {
  if (!Array.isArray(expenses)) return 0;

  return expenses.reduce((total, expense) => {
    const amount = Number(expense?.amount);
    if (!Number.isFinite(amount)) return total;
    return total + amount;
  }, 0);
}

module.exports = calculateUserPaid;