function buildPayList(
  expenses = [],
  settlements = [],
  members = [],
  currentUserId
) {
  if (!Array.isArray(expenses) || !Array.isArray(members)) return [];

  const normalize = (id) => id.toString();
  const me = normalize(currentUserId);

  // ===============================
  // STEP 1: Member Map + Stats Init
  // ===============================
  const memberMap = {};
  const stats = {};

  members.forEach((m) => {
    const id = normalize(m._id);
    memberMap[id] = m;
    stats[id] = { paid: 0, share: 0 };
  });

  // ===============================
  // STEP 2: Process Expenses
  // ===============================
  expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    if (!Number.isFinite(amount)) return;

    const payerId = normalize(expense.paidBy);
    if (!stats[payerId]) return;

    // payer paid full
    stats[payerId].paid += amount;

    // EQUAL split
    if (expense.splitType === "EQUAL") {
      const perHead = Number(
        (amount / expense.splits.length).toFixed(2)
      );

      expense.splits.forEach((s) => {
        const uid = normalize(s.userId);
        if (stats[uid]) stats[uid].share += perHead;
      });
    }

    // EXACT split
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
  // STEP 3: Net Balance Map
  // net = paid - share
  // ===============================
  const netMap = {};

  Object.entries(stats).forEach(([uid, v]) => {
    netMap[uid] = Number((v.paid - v.share).toFixed(2));
  });

  // ===============================
  // STEP 4: Apply Settlements
  // ===============================
  settlements.forEach((s) => {
    const from = normalize(s.from);
    const to = normalize(s.to);
    const amount = Number(s.amount);

    if (!Number.isFinite(amount)) return;

    if (netMap[from] !== undefined) {
      netMap[from] = Number((netMap[from] + amount).toFixed(2));
    }

    if (netMap[to] !== undefined) {
      netMap[to] = Number((netMap[to] - amount).toFixed(2));
    }
  });

  const myNet = netMap[me] ?? 0;

  // If I don't owe anyone
  if (myNet >= 0) return [];

  let remaining = Math.abs(myNet);

  // ===============================
  // STEP 5: Find Creditors
  // ===============================
  const creditors = Object.entries(netMap)
    .filter(([uid, net]) => uid !== me && net > 0)
    .map(([uid, net]) => ({ uid, net }))
    .sort((a, b) => b.net - a.net);

  // ===============================
  // STEP 6: Greedy Distribution
  // ===============================
  const payList = [];

  for (const c of creditors) {
    if (remaining <= 0) break;

    const pay = Math.min(c.net, remaining);
    const member = memberMap[c.uid];

    payList.push({
      userId: c.uid,
      name: member?.name || "Unknown",
      amount: Number(pay.toFixed(2)),
    });

    remaining -= pay;
  }

  return payList;
}

module.exports = buildPayList;