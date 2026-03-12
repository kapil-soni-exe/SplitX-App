import { useEffect, useState } from "react";
import {
  createExpense,
  fetchExpensesByGroup,
  updateExpense,
  deleteExpense
} from "../../api/expense.api";

export function useGroupExpenses(groupId, onExpenseCreated) {

  const [expenses, setExpenses] = useState([]);

  /* =========================
     Fetch expenses
  ========================= */

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

  /* =========================
     Create expense (API)
  ========================= */

  const addExpense = async (expenseData) => {
    try {
      await createExpense(expenseData);

      if (onExpenseCreated) {
        await onExpenseCreated();
      }

      // No refetch needed → socket will sync
    } catch (err) {
      console.error("Create expense failed:", err);
    }
  };

  /* =========================
     Update expense (API)
  ========================= */

  const updateExpenseById = async (id, expenseData) => {
    try {
      const res = await updateExpense(id, expenseData);
      const updatedExpense = res.data.expense;

      setExpenses((prev) =>
        prev.map((e) =>
          e._id === updatedExpense._id ? updatedExpense : e
        )
      );
    } catch (err) {
      console.error("Update expense failed:", err);
    }
  };

  /* =========================
     Delete expense (API)
  ========================= */

  const deleteExpenseById = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      // socket will update UI
    } catch (err) {
      console.error("Delete expense failed:", err);
    }
  };

  

  /* =========================
     Socket helpers (NO API)
  ========================= */

  const addExpenseLocal = (expense) => {
    setExpenses((prev) => {

      // prevent duplicates
      const exists = prev.some(e => e._id === expense._id);
      if (exists) return prev;

      return [expense, ...prev];
    });
  };

  const updateExpenseLocal = (expense) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e._id === expense._id ? expense : e
      )
    );
  };

  const deleteExpenseLocal = ({ expenseId, deletedBy }) => {

    setExpenses((prev) =>
      prev.map((e) =>
        String(e._id) === String(expenseId)
          ? {
              ...e,
              deletedAt: new Date(),
              deletedBy
            }
          : e
      )
    );
    

    
  };



  const addJoinActivityLocal = ({ user, createdAt }) => {
  setExpenses(prev => [
    ...prev,
    {
      _id: `join-${user._id}-${createdAt}`,
      type: "JOIN",
      user,
      createdAt
    }
  ]);
};

const addLeaveActivityLocal = ({ user, createdAt }) => {
  setExpenses(prev => [
    ...prev,
    {
      _id: `leave-${user._id}-${createdAt}`,
      type: "LEAVE",
      user,
      createdAt
    }
  ]);
};

function updateAdminLocal(adminId) {
  setGroup((prev) => ({
    ...prev,
    admin: adminId
  }));
}
  /* =========================
     Expose API + socket helpers
  ========================= */

  return {
    expenses,
    addExpense,
    updateExpenseById,
    deleteExpenseById,
    addExpenseLocal,
    updateExpenseLocal,
    deleteExpenseLocal,
    addJoinActivityLocal,
    addLeaveActivityLocal,

  };
}