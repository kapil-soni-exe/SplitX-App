/**
 * GroupDetails
 * ------------
 * Container component for a group's expense chat screen.
 *
 * Responsibilities:
 * - Render group header and summary
 * - Display expense list (chat-style)
 * - Handle expense selection (detail view)
 * - Manage add / edit expense flows
 * - Handle delete directly (confirmation modal is managed inside ExpenseDetail)
 */

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import "./GroupDetails.css";

import { RiArrowLeftCircleLine } from "@remixicon/react";

import Model from "../../../../components/comman/Model";

import AddExpenseForm from "./AddExpenseForm/AddExpenseForm";
import ExpenseDetail from "./ExpenseDetail";
import ExpenseChatList from "./ExpenseChatList";
import GroupSummaryStrip from "./GroupSummaryStrip";
import SettleModal from "./SettleModal/SettleModal";
import { buildJoinActivities } from "../../utils/joinActivityBuilder";
import { buildLeaveActivities } from "../../utils/buildLeaveActivities";

import { useAuth } from "../../../../context/AuthContext";
import { useGroupDetail } from "../../../../hooks/useGroupDetail";
import { useGroupExpenses } from "../../../../hooks/useGroupExpenses";
import { useGroupSocket } from "../../../../hooks/useGroupSocket";
import { useGroupSettlement } from "../../../../hooks/useGroupSettlement";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/toastHandler";
import Spinner from "../../../../components/Loaders/Spinner";

function GroupDetails({ groupId, onBack, onOpenInfo, onExpenseCreated, openExpenseId }) {
  /* 
     Local UI State*/

  const [open, setOpen] = useState(false); // add/edit modal
  const [selectedExpense, setSelectedExpense] = useState(null); // detail modal
  const [editingExpense, setEditingExpense] = useState(null); // edit flow
  const [showSettle, setShowSettle] = useState(false); // settle modal

  /* Hooks */

  const { user } = useAuth();
  const { group, loading, updateAdminLocal, removeMemberLocal, addMemberLocal } = useGroupDetail(groupId);
  const { handleCreateSettlement, creating } = useGroupSettlement(groupId);

  const {
    expenses,
    addExpense,
    updateExpenseById,
    deleteExpenseById,
    addExpenseLocal,
    updateExpenseLocal,
    deleteExpenseLocal,
    addJoinActivityLocal,
    addLeaveActivityLocal,
  } = useGroupExpenses(groupId, onExpenseCreated);

  useGroupSocket(groupId, {
    onExpenseAdded: (expense) => {
      addExpenseLocal(expense);
    },

    onExpenseUpdated: (expense) => {
      updateExpenseLocal(expense);
    },

    onExpenseDeleted: (data) => {
      deleteExpenseLocal(data);
    },

    onMemberJoined: (data) => {
      addJoinActivityLocal(data);
      // Instantly add member to the members list in cache
      if (data?.user) addMemberLocal(data.user);
    },

    onMemberLeft: (data) => {
      addLeaveActivityLocal(data);
      // Instantly remove member from the members list in cache
      if (data?.user?._id) removeMemberLocal(data.user._id);
    },

    onAdminChanged: (data) => {
      if (data?.adminId) {
        updateAdminLocal(data.adminId);
      }
    },
  });

  const joinActivities = buildJoinActivities(group);
  const leaveActivities = buildLeaveActivities(group);
  const timeline = [...expenses, ...joinActivities, ...leaveActivities];
  const chatRef = useRef(null);

  // Auto Scroll to bottom
  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [timeline]);

  // ✅ Auto-open expense detail when navigated from Dashboard RecentActivity
  useEffect(() => {
    if (!openExpenseId || expenses.length === 0) return;
    const match = expenses.find((e) => e._id === openExpenseId);
    if (match) {
      setSelectedExpense(match);
    }
  }, [openExpenseId, expenses]);

  /*Handlers*/

  // Create expense
  const handleAddExpense = async (expenseData) => {
    try {
      setOpen(false);
      const res = await addExpense(expenseData);
      if (res?.success === false) {
        showErrorToast(res.message || "Failed to add expense");
        return;
      }
      showSuccessToast("Expense added ");
    } catch (err) {
      showErrorToast(err);
    }
  };

  // Open edit flow
  const handleEditExpense = (expense) => {
    setSelectedExpense(null);
    setEditingExpense(expense);
    setOpen(true);
  };

  // Update expense
  const handleUpdateExpense = async (expenseData) => {
    try {
      const res = await updateExpenseById(editingExpense._id, expenseData);
      if (res?.success === false) {
        showErrorToast(res.message || "Failed to update expense");
        return;
      }
      showSuccessToast("Expense updated ");

      setOpen(false);
      setEditingExpense(null);
      setSelectedExpense(null);
    } catch (err) {
      showErrorToast(err);
    }
  };

  // Delete expense — called directly after ExpenseDetail's inner ConfirmModal confirms
  const handleDeleteExpense = async (expense) => {
    try {
      const expenseId = expense?._id || expense;
      const res = await deleteExpenseById(expenseId);
      if (res?.success === false) {
        showErrorToast(res.message || "Failed to delete expense");
        return;
      }
      showSuccessToast("Expense deleted ");
      setSelectedExpense(null);
    } catch (err) {
      showErrorToast(err);
    }
  };

  /* 
     Conditional Rendering */

  if (loading) {
    return <Spinner />;
  }

  if (!group) {
    return <div className="group-detail-empty">Group not found</div>;
  }

  const myExpense = expenses
    .filter((e) => (e.paidBy?._id || e.paidBy) === user.id)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="group-detail">
      {/* HEADER */}
      <div className="group-chat-header">
        <button className="group-back-btn" onClick={onBack}>
          <RiArrowLeftCircleLine size={28} />
        </button>

        <div className="group-header-info" onClick={onOpenInfo}>
          <h2>{group.name}</h2>
          <span>{group.members?.length || 0} members</span>
        </div>
      </div>

      {/* SUMMARY */}
      <GroupSummaryStrip myExpense={myExpense} totalExpense={totalExpense} />

      {/* CHAT BODY */}
      <div ref={chatRef} className="group-chat-body">
        <ExpenseChatList
          expenses={timeline}
          user={user}
          onSelectExpense={setSelectedExpense}
        />
      </div>

      {/* EXPENSE DETAIL MODAL */}
      <Model
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
      >
        <ExpenseDetail
          expense={selectedExpense}
          currentUser={user}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </Model>

      {/* FOOTER */}
      <div className="group-chat-footer">
        <button className="chat-secondary-btn" onClick={() => setShowSettle(true)}>Settle</button>

        <button className="chat-primary-btn" onClick={() => setOpen(true)}>
          Add Expense
        </button>
      </div>

      {/* ADD / EDIT EXPENSE MODAL */}
      <Model
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditingExpense(null);
        }}
      >
        <AddExpenseForm
          members={group.members}
          groupId={group._id}
          initialData={editingExpense}
          isEdit={!!editingExpense}
          onAddExpense={editingExpense ? handleUpdateExpense : handleAddExpense}
        />
      </Model>

      {/* SETTLE MODAL */}
      <Model isOpen={showSettle} onClose={() => setShowSettle(false)}>
        <SettleModal
          payList={group?.payList || []}
          receiveList={group?.receiveList || []}
          creating={creating}
          onSettle={async (payload) => {
            const res = await handleCreateSettlement(payload);
            if (res?.success) {
              showSuccessToast("Settlement recorded!");
              setShowSettle(false);
            } else {
              showErrorToast(res?.message || "Settlement failed");
            }
          }}
        />
      </Model>
    </div>
  );
}

export default GroupDetails;
