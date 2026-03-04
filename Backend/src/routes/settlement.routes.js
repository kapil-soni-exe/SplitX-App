// routes/settlement.routes.js

const express = require("express");
const router = express.Router();
const {
  createSettlement,
  getGroupSettlements,
} = require("../controller/settlement.controller");
const Protected = require("../../middleware/auth.middleware");

router.post("/:groupId/settlements", Protected, createSettlement);

router.get("/:groupId/settlements", Protected, getGroupSettlements);

module.exports = router;
