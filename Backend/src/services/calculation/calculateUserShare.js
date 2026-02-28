/**
 * Calculate how much share (responsibility) a single user has
 * across all expenses in a group.
 *
 * Schema-based logic:
 * - BOTH EQUAL and EXACT use `splits` array
 * - EQUAL  → amount / splits.length
 * - EXACT  → read user.amount from splits
 */

function calculateUserShare(expenses = [], userId) {
  if (!Array.isArray(expenses) || !userId) return 0;

  return expenses.reduce((totalShare, expense) => {
    const amount = Number(expense?.amount);
    if (!Number.isFinite(amount)) return totalShare;

    const splitType = expense?.splitType;
    const splits = expense?.splits || [];

    if (!Array.isArray(splits) || splits.length === 0) {
      return totalShare;
    }

    // Check if current user exists in splits
    const userSplit = splits.find(
      (s) => s.userId?.toString() === userId.toString()
    );

    if (!userSplit) return totalShare;

    /**
     * ======================
     * EQUAL SPLIT
     * ======================
     * User share = total amount / number of users
     */
    if (splitType === "EQUAL") {
      const perHead = amount / splits.length;
      return totalShare + perHead;
    }

    /**
     * ======================
     * EXACT SPLIT
     * ======================
     * User share = explicitly defined amount
     */
    if (splitType === "EXACT") {
      const userAmount = Number(userSplit.amount);
      if (!Number.isFinite(userAmount)) return totalShare;
      return totalShare + userAmount;
    }

    return totalShare;
  }, 0);
}

module.exports = calculateUserShare;