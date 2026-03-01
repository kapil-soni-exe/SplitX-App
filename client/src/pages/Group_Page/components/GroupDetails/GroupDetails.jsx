import React, { useEffect, useState } from "react";
import "./GroupDetails.css";
import { getDayLabel, sortByDate, formatTime } from "../../utils/dateHelper";
import { activityFormatter } from "../../utils/activityFormatter";
import { RiArrowLeftCircleLine } from "@remixicon/react";
import Model from "../../../../components/comman/Model";
import AddExpenseForm from "./AddExpenseForm/AddExpenseForm";
import { useGroupDetail } from "../../../../hooks/useGroupDetail";
import { useAuth } from "../../../../context/AuthContext";
import ExpenseDetail from "./ExpenseDetail";
import {
  createExpense,
  fetchExpensesByGroup,
} from "../../../../../api/expense.api";


import GroupSummaryStrip from "./GroupSummaryStrip";

function GroupDetails({ groupId, onBack, onOpenInfo, onExpenseCreated }) {
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([]); // ✅ hook on top
  const [selectedExpense, setSelectedExpense] = useState(null);

  const { user } = useAuth();
  const { group, loading } = useGroupDetail(groupId);

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

  // 🔹 create expense
  const handleAddExpense = async (expenseData) => {
    setOpen(false);

    try {
      await createExpense(expenseData);

      await onExpenseCreated();

      // re-fetch expenses
      const res = await fetchExpensesByGroup(groupId);
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error(
        "Create expense failed:",
        err.response?.data || err.message,
      );
    }
  };

  // conditional returns AFTER hooks
  if (loading) {
    return <div className="group-loading">Loading group…</div>;
  }

  if (!group) {
    return <div className="group-detail-empty">Group not found</div>;
  }

  const sortedExpenses = sortByDate(expenses);
  let lastLabel = null;

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
      <GroupSummaryStrip />

      {/* CHAT BODY */}
      <div className="group-chat-body">
        {sortedExpenses.map((expense) => {
          const label = getDayLabel(expense.createdAt);
          const showLabel = label !== lastLabel;
          lastLabel = label;

          const isOutgoing = expense.paidBy?._id === user?.id;

          return (
            <React.Fragment key={expense._id}>
              {showLabel && <div className="chat-date-separator">{label}</div>}

              <div
                className={`chat-message ${
                  isOutgoing ? "outgoing" : "incoming"
                }`}
                onClick={() => setSelectedExpense(expense)}
              >
                <p>{activityFormatter(expense,user?._id || user?.id)}</p>
                {expense.note && <p className="chat-note">{expense.note}</p>}
                <span>{formatTime(expense.createdAt)}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <Model
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
      >
        <ExpenseDetail
          expense={selectedExpense}
          currentUser={user}
          onEdit={(exp) => console.log("Edit", exp)}
          onDelete={(exp) => console.log("Delete", exp)}
        />
      </Model>

      {/* FOOTER */}
      <div className="group-chat-footer">
        <button className="chat-secondary-btn">Settle</button>

        <button className="chat-primary-btn" onClick={() => setOpen(true)}>
          Add Expense
        </button>

        <Model isOpen={open} onClose={() => setOpen(false)}>
          <AddExpenseForm
            members={group.members}
            groupId={group._id}
            onAddExpense={handleAddExpense}
          />
        </Model>
      </div>
    </div>
  );
}

export default GroupDetails;
