// src/services/calculation/calculateTotalSpent.js

function calculateTotalSpent(expenses = []) {
  // Safety: agar galat input aa jaye
  if (!Array.isArray(expenses)) return 0;

  return expenses.reduce((total, expense) => {
    // amount ko forcefully number banao
    const amount = Number(expense?.amount);

    // agar valid number nahi hai to skip
    if (!Number.isFinite(amount)) return total;

    return total + amount;
  }, 0);
}

module.exports = calculateTotalSpent;