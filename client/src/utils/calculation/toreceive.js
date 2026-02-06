export function getReceiveList(group, currentUserId) {
  if (!group || !group.expenses || !group.members) return [];

  // ---------- STEP 1: build paid/share ----------
  const state = group.members.reduce((acc, mem) => {
    acc[mem.id] = { paid: 0, share: 0 };
    return acc;
  }, {});

  group.expenses.forEach((expense) => {
    const share =
      expense.amount / expense.splitBetween.length;

    // payer paid full
    state[expense.paidBy].paid += expense.amount;

    // everyone gets share
    expense.splitBetween.forEach((uid) => {
      state[uid].share += share;
    });
  });

  // ---------- STEP 2: net ----------
  const netMap = Object.entries(state).reduce(
    (acc, [uid, val]) => {
      acc[uid] = val.paid - val.share;
      return acc;
    },
    {}
  );

  const myNet = netMap[currentUserId];

  // if user should not receive anything
  if (myNet <= 0) return [];

  let remainingToReceive = myNet;

  // ---------- STEP 3: debtors ----------
  const debtors = Object.entries(netMap)
    .filter(
      ([uid, net]) =>
        uid !== currentUserId && net < 0
    )
    .map(([uid, net]) => ({
      uid,
      net: Math.abs(net),
    }));

  // ---------- STEP 4: distribute ----------
  return debtors.reduce((result, debtor) => {
    if (remainingToReceive <= 0) return result;

    const receiveAmount = Math.min(
      debtor.net,
      remainingToReceive
    );

    const member = group.members.find(
      (m) => m.id === debtor.uid
    );

    result.push({
      userId: debtor.uid,
      name: member?.name || "Unknown",
      amount: Math.round(receiveAmount),
    });

    remainingToReceive -= receiveAmount;

    return result;
  }, []);
}
