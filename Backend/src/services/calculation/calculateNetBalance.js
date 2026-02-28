/**
 * Calculate net balance for a user
 * Positive  -> user will receive money
 * Negative  -> user owes money
 * Zero      -> settled
 */
function calculateNetBalance(userPaid = 0, userShare = 0) {
  const paid = Number(userPaid);
  const share = Number(userShare);

  if (!Number.isFinite(paid) || !Number.isFinite(share)) return 0;

  return paid - share;
}

module.exports = calculateNetBalance;