/**
 * useGroupExpenses
 * ----------------
 * Handles all expense-related side effects for a group:
 * - Fetch expenses by groupId
 * - Create a new expense
 * - Update an existing expense
 *
 * NOTE:
 * - UI state (modal, selection) is NOT handled here
 * - Logic is moved as-is from GroupDetails
 */

import { useEffect, useState } from "react";
import {
  createExpense,
  fetchExpensesByGroup,
  updateExpense,
  deleteExpense
} from "../../api/expense.api";

export function useGroupExpenses(groupId, onExpenseCreated) {
  const [expenses, setExpenses] = useState([]);

  // 🔹 fetch expenses
  useEffect(() => {
    if (!groupId) return;

    const loadExpenses = async () => {
      try {
        const res = await fetchExpensesByGroup(groupId);
        setExpenses(res.data.expenses);
      } catch (err) {
        console.error("Fetch expenses failed:", err);
      }
    };

    loadExpenses();
  }, [groupId]);

  // create expense (same logic as before)
  const addExpense = async (expenseData) => {
    await createExpense(expenseData);
    await onExpenseCreated();

    const res = await fetchExpensesByGroup(groupId);
    setExpenses(res.data.expenses);
  };

  //  update expense (local replace)
  const updateExpenseById = async (id, expenseData) => {
    const res = await updateExpense(id, expenseData);
    const updatedExpense = res.data.expense;

    setExpenses((prev) =>
      prev.map((e) =>
        e._id === updatedExpense._id ? updatedExpense : e
      )
    );
  };

   // Delete expense (soft delete)
  
    const deleteExpenseById = async (expenseId) => {
    await deleteExpense(expenseId);

    //  ALWAYS refetch after delete
    const res = await fetchExpensesByGroup(groupId);
    setExpenses(res.data.expenses);
  };

  return {
    expenses,
    addExpense,
    updateExpenseById,
    deleteExpenseById
  };
}