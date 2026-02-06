export function getPayList(group, currentUserId) {
  if (!group || !group.expenses || !group.members) return [];

  // ---------- STEP 1: init stats using reduce ----------
  const stats = group.members.reduce((acc, m) => {
    acc[m.id] = { paid: 0, share: 0 };
    return acc;
  }, {});

  // ---------- STEP 2: fill paid & share ----------
 group.expenses.forEach((expense) => {
  const share =
    expense.amount / expense.splitBetween.length;

  // payer paid full amount
  stats[expense.paidBy].paid += expense.amount;

  // everyone gets their share
  expense.splitBetween.forEach((uid) => {
    stats[uid].share += share;
  });
});

  // ---------- STEP 3: net calculation ----------
  const netMap = Object.entries(stats).reduce(
    (acc, [uid, val]) => {
      acc[uid] = val.paid - val.share;
      return acc;
    },
    {}
  );

  const myNet = netMap[currentUserId];

  // if user owes nothing
  if (myNet >= 0) return [];

  let remainingToPay = Math.abs(myNet);

  // ---------- STEP 4: creditors ----------
  const creditors = Object.entries(netMap)
    .filter(
      ([uid, net]) =>
        uid !== currentUserId && net > 0
    )
    .map(([uid, net]) => ({ uid, net }));

  // ---------- STEP 5: distribute ----------
  return creditors.reduce((result, creditor) => {
    if (remainingToPay <= 0) return result;

    const payAmount = Math.min(
      creditor.net,
      remainingToPay
    );

    const member = group.members.find(
      (m) => m.id === creditor.uid
    );

    result.push({
      userId: creditor.uid,
      name: member?.name || "Unknown",
      amount: Math.round(payAmount),
    });

    remainingToPay -= payAmount;

    return result;
  }, []);
}
