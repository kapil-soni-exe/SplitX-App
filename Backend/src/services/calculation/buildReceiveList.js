function buildReceiveList(
  expenses = [],
  settlements = [],
  members = [],
  currentUserId
) {
  if (!Array.isArray(expenses) || !Array.isArray(members)) return [];

  const normalize = (id) => id.toString();
  const me = normalize(currentUserId);

  // ===============================
  // STEP 1: Initialize stats
  // ===============================
  const stats = members.reduce((acc, m) => {
    acc[normalize(m._id)] = { paid: 0, share: 0 };
    return acc;
  }, {});

  // ===============================
  // STEP 2: Process Expenses
  // ===============================
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

  // ===============================
  // STEP 3: Build Net Map
  // ===============================
  const netMap = Object.fromEntries(
    Object.entries(stats).map(([uid, v]) => [
      uid,
      Number((v.paid - v.share).toFixed(2)),
    ])
  );

  // ===============================
  // STEP 4: Apply Settlements
  // ===============================
  settlements.forEach((settle) => {
    const from = normalize(settle.from);
    const to = normalize(settle.to);
    const amount = Number(settle.amount);

    if (!Number.isFinite(amount)) return;

    if (netMap[from] !== undefined) {
      netMap[from] += amount;
    }

    if (netMap[to] !== undefined) {
      netMap[to] -= amount;
    }
  });

  const myNet = netMap[me];

  // If I am not supposed to receive anything
  if (myNet <= 0) return [];

  let remaining = myNet;

  // ===============================
  // STEP 5: Find Debtors
  // ===============================
  const debtors = Object.entries(netMap)
    .filter(([uid, net]) => uid !== me && net < 0)
    .map(([uid, net]) => ({
      uid,
      net: Math.abs(net),
    }))
    .sort((a, b) => b.net - a.net);

  // ===============================
  // STEP 6: Greedy Distribution
  // ===============================
  return debtors.reduce((list, d) => {
    if (remaining <= 0) return list;

    const receive = Math.min(d.net, remaining);
    const member = members.find(
      (m) => normalize(m._id) === d.uid
    );

    list.push({
      userId: d.uid,
      name: member?.name || "User",
      amount: Number(receive.toFixed(2)),
    });

    remaining -= receive;
    return list;
  }, []);
}

module.exports = buildReceiveList;