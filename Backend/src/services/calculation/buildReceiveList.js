function buildReceiveList(expenses = [], members = [], currentUserId) {
  if (!Array.isArray(expenses) || !Array.isArray(members)) return [];

  const normalize = (id) => id.toString();

  // STEP 1: init stats
  const stats = members.reduce((acc, m) => {
    acc[normalize(m._id)] = { paid: 0, share: 0 };
    return acc;
  }, {});

  // STEP 2: paid & share
  expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    if (!Number.isFinite(amount)) return;

    const payerId = normalize(expense.paidBy);
    if (!stats[payerId]) return;

    stats[payerId].paid += amount;

    // EQUAL
    if (expense.splitType === "EQUAL") {
      const perHead = Number(
        (amount / expense.splits.length).toFixed(2)
      );

      expense.splits.forEach((s) => {
        const uid = normalize(s.userId);
        if (stats[uid]) stats[uid].share += perHead;
      });
    }

    // EXACT
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

  // STEP 3: net
  const netMap = Object.fromEntries(
    Object.entries(stats).map(([uid, v]) => [
      uid,
      Number((v.paid - v.share).toFixed(2)),
    ])
  );

  const myNet = netMap[normalize(currentUserId)];
  if (myNet <= 0) return [];

  let remaining = myNet;

  // STEP 4: debtors
  const debtors = Object.entries(netMap)
    .filter(([uid, net]) => uid !== normalize(currentUserId) && net < 0)
    .map(([uid, net]) => ({
      uid,
      net: Math.abs(net),
    }));

  // STEP 5: receive list
  return debtors.reduce((list, d) => {
    if (remaining <= 0) return list;

    const receive = Math.min(d.net, remaining);
    const member = members.find(
      (m) => normalize(m._id) === d.uid
    );

    list.push({
      userId: d.uid,
      name: member?.name ?? "User",
      amount: Number(receive.toFixed(2)),
    });

    remaining -= receive;
    return list;
  }, []);
}

module.exports = buildReceiveList;