// utils/splitCalculator.js

// Calculate equal split for an expense
const calculateEqualSplit = ({ amount, splitBetween, paidBy }) => {
  // splitBetween must not be empty
  if (!splitBetween || splitBetween.length === 0) {
    throw new Error("Split members cannot be empty");
  }

  const memberCount = splitBetween.length;

  // Raw share (may produce floating point values)
  const rawShare = amount / memberCount;

  // Round each share to 2 decimal places
  const roundedShare = Number(rawShare.toFixed(2));

  // Create initial splits
  const splits = splitBetween.map((userId) => ({
    userId,
    amount: roundedShare,
  }));

  // Calculate total assigned amount after rounding
  const totalAssigned = roundedShare * memberCount;

  // Find rounding difference
  const diff = Number((amount - totalAssigned).toFixed(2));

  /**
   * Rounding rule:
   * Any remaining difference is adjusted to the payer
   */
  if (diff !== 0) {
    const payerSplit = splits.find(
      (split) => split.userId.toString() === paidBy.toString()
    );

    // Safety check
    if (!payerSplit) {
      throw new Error("PaidBy user must be included in splitBetween");
    }

    // Adjust payer's amount
    payerSplit.amount = Number(
      (payerSplit.amount + diff).toFixed(2)
    );
  }

  return splits;
};


// Unequal Splits

const calculateExactSplit = ({ amount, splits, paidBy }) => {
  if (!splits || splits.length === 0) {
    throw new Error("Splits cannot be empty");
  }

  // Check duplicate users
  const userIds = splits.map(s => s.userId.toString());
  if (new Set(userIds).size !== userIds.length) {
    throw new Error("Duplicate users in splits");
  }

  // Validate total
  const total = Number(
    splits.reduce((sum, s) => sum + Number(s.amount || 0), 0).toFixed(2)
  );

  if (total !== Number(amount)) {
    throw new Error("Split total must equal expense amount");
  }

  // Ensure paidBy is included
  const payerIncluded = splits.some(
    s => s.userId.toString() === paidBy.toString()
  );

  if (!payerIncluded) {
    throw new Error("PaidBy user must be included in splits");
  }

  // Normalize values
  return splits.map(s => ({
    userId: s.userId,
    amount: Number(Number(s.amount).toFixed(2)),
  }));
};

module.exports = { calculateEqualSplit,calculateExactSplit };