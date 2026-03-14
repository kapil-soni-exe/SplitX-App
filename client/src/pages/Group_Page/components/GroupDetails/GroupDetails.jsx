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
 * - Handle delete with reusable confirm modal
 *
 * Notes:
 * - Expense side effects are handled by useGroupExpenses
 * - This component only coordinates UI + data
 */

import React, { useState, useRef } from "react";
import "./GroupDetails.css";

import { RiArrowLeftCircleLine } from "@remixicon/react";

import Model from "../../../../components/comman/Model";
import ConfirmModel from "../../../../components/comman/ConfirmModel";

import AddExpenseForm from "./AddExpenseForm/AddExpenseForm";
import ExpenseDetail from "./ExpenseDetail";
import ExpenseChatList from "./ExpenseChatList";
import GroupSummaryStrip from "./GroupSummaryStrip";
import { buildJoinActivities } from "../../utils/joinActivityBuilder";
import { buildLeaveActivities } from "../../utils/buildLeaveActivities";

import { useAuth } from "../../../../context/AuthContext";
import { useGroupDetail } from "../../../../hooks/useGroupDetail";
import { useGroupExpenses } from "../../../../hooks/useGroupExpenses";
import { useGroupSocket } from "../../../../hooks/useGroupSocket";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/toastHandler";

import { useLayoutEffect } from "react";
import Spinner from "../../../../components/Loaders/Spinner";

function GroupDetails({ groupId, onBack, onOpenInfo, onExpenseCreated }) {
  /* 
     Local UI State*/

  const [open, setOpen] = useState(false); // add/edit modal
  const [selectedExpense, setSelectedExpense] = useState(null); // detail modal
  const [editingExpense, setEditingExpense] = useState(null); // edit flow
  const [deleteTarget, setDeleteTarget] = useState(null); // confirm delete

  /* Hooks */

  const { user } = useAuth();
  const { group, loading } = useGroupDetail(groupId);

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
    },
    onMemberLeft: (data) => {
      addLeaveActivityLocal(data);
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

  /*Handlers*/

  // Create expense
  // Create expense
  const handleAddExpense = async (expenseData) => {
    try {
      // close modal first
      setOpen(false);

      // call API
      await addExpense(expenseData);

      // success toast
      showSuccessToast("Expense added ");
    } catch (err) {
      // error toast
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
  // Update expense
  const handleUpdateExpense = async (expenseData) => {
    try {
      await updateExpenseById(editingExpense._id, expenseData);

      // success toast
      showSuccessToast("Expense updated ");

      // reset UI state
      setOpen(false);
      setEditingExpense(null);
      setSelectedExpense(null);
    } catch (err) {
      showErrorToast(err);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (expense) => {
    setDeleteTarget(expense);
  };

  // Confirm delete
  // Confirm delete
  const confirmDeleteExpense = async () => {
    try {
      await deleteExpenseById(deleteTarget._id);

      // success toast
      showSuccessToast("Expense deleted ");

      // reset state
      setDeleteTarget(null);
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
          onDelete={handleDeleteClick}
        />
      </Model>

      {/* FOOTER */}
      <div className="group-chat-footer">
        <button className="chat-secondary-btn">Settle</button>

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

      {/* CONFIRM DELETE MODAL  */}
      <ConfirmModel
        isOpen={!!deleteTarget}
        title="Delete expense?"
        description="This expense will be removed from calculations. Other members will see that it was deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteExpense}
      />
    </div>
  );
}

export default GroupDetails;
