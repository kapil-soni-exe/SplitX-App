const express = require("express");
const router = express.Router();
const { createExpense,getExpensesByGroup } = require("../controller/expense.controller");
const protected = require("../../middleware/auth.middleware")

// Create Expense
router.post("/", protected,createExpense);

// fetch expenses by group
router.get("/", protected, getExpensesByGroup);

module.exports = router;