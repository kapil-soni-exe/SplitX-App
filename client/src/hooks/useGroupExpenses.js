import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  fetchExpensesByGroup,
  updateExpense,
  deleteExpense,
} from "../../api/expense.api";

export function useGroupExpenses(groupId, onExpenseCreated) {
  const queryClient = useQueryClient();

  /* =========================
     Fetch expenses (React Query)
     - isCurrent stale-response guard handled automatically by React Query
     - placeholderData keeps previous group's list during group switch
  ========================= */

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", groupId],
    queryFn: async () => {
      const res = await fetchExpensesByGroup(groupId);
      return res.data.expenses;
    },
    enabled: !!groupId,
    placeholderData: (prev) => prev,
  });

  /* =========================
     Create expense (API)
     - Socket will sync UI via addExpenseLocal
     - invalidateQueries acts as safety net if socket lags
  ========================= */

  const addExpense = async (expenseData) => {
    try {
      await createExpense(expenseData);

      if (onExpenseCreated) {
        await onExpenseCreated();
      }

      // Safety net: if socket event is delayed, force a fresh fetch
      queryClient.invalidateQueries({ queryKey: ["expenses", groupId] });

      return { success: true };
    } catch (err) {
      console.error("Create expense failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add expense",
      };
    }
  };

  /* =========================
     Update expense (API)
     - Optimistically updates cache immediately, socket will confirm
  ========================= */

  const updateExpenseById = async (id, expenseData) => {
    try {
      const res = await updateExpense(id, expenseData);
      const updatedExpense = res.data.expense;

      // Immediately reflect the update in cache
      queryClient.setQueryData(["expenses", groupId], (prev = []) =>
        prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
      );

      return { success: true, expense: updatedExpense };
    } catch (err) {
      console.error("Update expense failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update expense",
      };
    }
  };

  /* =========================
     Delete expense (API)
     - Socket will trigger deleteExpenseLocal to soft-delete in cache
  ========================= */

  const deleteExpenseById = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      return { success: true };
    } catch (err) {
      console.error("Delete expense failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete expense",
      };
    }
  };

  /* =========================
     Socket helpers — update React Query cache directly (NO API)
  ========================= */

  const addExpenseLocal = (expense) => {
    queryClient.setQueryData(["expenses", groupId], (prev = []) => {
      const exists = prev.some((e) => e._id === expense._id);
      if (exists) return prev;
      return [expense, ...prev];
    });
  };

  const updateExpenseLocal = (expense) => {
    queryClient.setQueryData(["expenses", groupId], (prev = []) =>
      prev.map((e) => (e._id === expense._id ? expense : e))
    );
  };

  const deleteExpenseLocal = ({ expenseId, deletedBy }) => {
    queryClient.setQueryData(["expenses", groupId], (prev = []) =>
      prev.map((e) =>
        String(e._id) === String(expenseId)
          ? { ...e, deletedAt: new Date(), deletedBy }
          : e
      )
    );
  };

  const addJoinActivityLocal = ({ user, createdAt }) => {
    queryClient.setQueryData(["expenses", groupId], (prev = []) => [
      ...prev,
      {
        _id: `join-${user._id}-${createdAt}`,
        type: "JOIN",
        user,
        createdAt,
      },
    ]);
  };

  const addLeaveActivityLocal = ({ user, createdAt }) => {
    queryClient.setQueryData(["expenses", groupId], (prev = []) => [
      ...prev,
      {
        _id: `leave-${user._id}-${createdAt}`,
        type: "LEAVE",
        user,
        createdAt,
      },
    ]);
  };

  /* =========================
     Expose API + socket helpers
     (return shape unchanged — consuming components need zero changes)
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