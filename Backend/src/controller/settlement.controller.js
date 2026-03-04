const Settlement = require("../models/settlement.model");
const Group = require("../models/group.model");
const { getPayList } = require("../services/groups.service");

// CREATE SETTLEMENT
// POST /groups/:groupId/settlements

async function createSettlement(req, res) {
  try {
    const { groupId } = req.params;
    const { to, amount, note } = req.body;
    const from = req.user._id;

    const normalizedAmount = Number(amount);

    //  Basic validation
    if (!to || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({
        message: "Invalid settlement data",
      });
    }

    if (from.toString() === to.toString()) {
      return res.status(400).json({
        message: "Cannot settle with yourself",
      });
    }

    //  Check group exists
    const group = await Group.findById(groupId).select("members").lean();

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    const memberIds = group.members.map((m) => m.userId.toString());

    if (
      !memberIds.includes(from.toString()) ||
      !memberIds.includes(to.toString())
    ) {
      return res.status(403).json({
        message: "Both users must be group members",
      });
    }

    //  Prevent Over-Settlement
    const payList = await getPayList(groupId, from);
    const allowed = payList.find((p) => p.userId.toString() === to.toString());

    if (!allowed) {
      return res.status(400).json({
        message: "No pending balance with this user",
      });
    }

    if (normalizedAmount > allowed.amount) {
      return res.status(400).json({
        message: "Settlement exceeds owed amount",
      });
    }

    //  Create settlement record
    const settlement = await Settlement.create({
      groupId,
      from,
      to,
      amount: normalizedAmount,
      note,
      createdBy: from,
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

// GET GROUP SETTLEMENT HISTORY
// GET /groups/:groupId/settlements

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
