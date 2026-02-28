function buildPayList(expenses = [], members = [], currentUserId) {
  if (!Array.isArray(expenses) || !Array.isArray(members)) return [];

  const normalize = (id) => id.toString();
  const me = normalize(currentUserId);

  // STEP 1
  const stats = members.reduce((acc, m) => {
    acc[normalize(m._id)] = { paid: 0, share: 0 };
    return acc;
  }, {});

  // STEP 2
  expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    if (!Number.isFinite(amount)) return;

    const payerId = normalize(expense.paidBy);
    if (!stats[payerId]) return;

    stats[payerId].paid += amount;

    if (expense.splitType === "EQUAL") {
      const perHead = Number(
        (amount / expense.splits.length).toFixed(2)
      );

      expense.splits.forEach((s) => {
        const uid = normalize(s.userId);
        if (stats[uid]) stats[uid].share += perHead;
      });
    }

    if (expense.splitType === "EXACT") {
      expense.splits.forEach((s) => {
        const uid = normalize(s.userId);
        const shareAmount = Number(s.amount);
        if (stats[uid] && Number.isFinite(shareAmount)) {
          stats[uid].share += shareAmount;
        }
      });
    }
  });

  // STEP 3
  const netMap = Object.fromEntries(
    Object.entries(stats).map(([uid, v]) => [
      uid,
      Number((v.paid - v.share).toFixed(2)),
    ])
  );

  const myNet = netMap[me];
  if (myNet >= 0) return [];

  let remaining = Math.abs(myNet);

  // STEP 4
  const creditors = Object.entries(netMap)
    .filter(([uid, net]) => uid !== me && net > 0)
    .map(([uid, net]) => ({ uid, net }))
    .sort((a, b) => b.net - a.net);

  // STEP 5
  return creditors.reduce((list, c) => {
    if (remaining <= 0) return list;

    const pay = Math.min(c.net, remaining);
    const member = members.find((m) => normalize(m._id) === c.uid);

    list.push({
      userId: c.uid,
      name: member?.name || "Unknown",
      amount: Number(pay.toFixed(2)),
    });

    remaining -= pay;
    return list;
  }, []);
}

module.exports = buildPayList