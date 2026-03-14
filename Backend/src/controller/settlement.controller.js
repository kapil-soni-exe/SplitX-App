const Settlement = require("../models/settlement.model");
const Group = require("../models/group.model");
const { getPayList } = require("../services/groups.service");
const createNotification = require("../services/notification/createNotification");

// CREATE SETTLEMENT
// POST /groups/:groupId/settlements

async function createSettlement(req, res) {
  try {
    const { groupId } = req.params;
    const { to, amount, note } = req.body;

    const from = req.user._id;
    const normalizedAmount = Number(amount);

    const group = await Group.findById(groupId)
      .select("members")
      .lean();

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    let finalFrom = from;
    let finalTo = to;

    // Check if current user owes someone
    const payList = await getPayList(groupId, from);

    const allowed = payList.find(
      (p) => p.userId.toString() === to.toString()
    );

    if (!allowed) {
      const reversePayList = await getPayList(groupId, to);

      const reverse = reversePayList.find(
        (p) => p.userId.toString() === from.toString()
      );

      if (!reverse) {
        return res.status(400).json({
          message: "No pending balance with this user",
        });
      }

      // Collect case: swap from/to
      finalFrom = to;
      finalTo = from;
    }

    const settlement = await Settlement.create({
      groupId,
      from: finalFrom,
      to: finalTo,
      amount: normalizedAmount,
      note,
      createdBy: from,
    });

    // Notify the user who received the payment
    const payee = await Group.findOne({ _id: groupId }).populate("members.userId", "name").lean();
    const groupName = payee ? payee.name : "a group";
    
    await createNotification({
      userIds: [finalTo],
      title: "Payment Received",
      message: `${req.user.name} just settled ₹${normalizedAmount} with you in ${groupName}.`,
      type: "settlement",
      metadata: { groupId }
    });

    return res.status(201).json({
      message: "Settlement recorded successfully",
      settlement,
    });
  } catch (error) {
    console.error("Create Settlement Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
/* =====================================================
   GET GROUP SETTLEMENT HISTORY
   GET /groups/:groupId/settlements
===================================================== */

async function getGroupSettlements(req, res) {
  try {
    const { groupId } = req.params;

    const settlements = await Settlement.find({ groupId })
      .populate("from", "name")
      .populate("to", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(settlements);
  } catch (error) {
    console.error("Fetch Settlement Error:", error);

    return res.status(500).json({
      message: "Failed to fetch settlements",
    });
  }
}

module.exports = {
  createSettlement,
  getGroupSettlements,
};