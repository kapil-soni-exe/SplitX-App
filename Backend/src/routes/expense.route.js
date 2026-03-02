const express = require("express");
const router = express.Router();
const { createExpense,getExpensesByGroup, updateExpense, deleteExpenseController } = require("../controller/expense.controller");
const protected = require("../../middleware/auth.middleware")

// Create Expense
router.post("/", protected,createExpense);

// fetch expenses by group
router.get("/", protected, getExpensesByGroup);

// Edit Expenses
router.patch("/:expenseId",protected,updateExpense)

// Delete Expense
router.delete("/:expenseId",protected,deleteExpenseController)



module.exports = router;