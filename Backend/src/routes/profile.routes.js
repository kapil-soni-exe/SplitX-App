const express = require("express");
const router = express.Router();

const { getProfileStats, updateProfile } = require("../controller/profile.controller");
const protect = require("../../middleware/auth.middleware");

router.get("/stats", protect, getProfileStats);
router.patch("/edit",protect,updateProfile)

module.exports = router;