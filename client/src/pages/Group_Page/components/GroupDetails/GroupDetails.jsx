import React, { useState } from "react";
import "./GroupDetails.css";
import { getDayLabel, sortByDate, formatTime } from "../../utils/dateHelper";
import { activityFormatter } from "../../utils/activityFormatter";
import { RiArrowLeftCircleLine } from "@remixicon/react";
import Model from "../../../../components/comman/Model"
import AddExpenseForm from "./AddExpenseForm";

const CURRENT_USER_ID = "u1";

function GroupDetails({ group,onBack,onOpenInfo }) {
  const [open, setOpen] = useState(false);

  const handleAddExpense = (newExpense) => {
  console.log("NEW EXPENSE:", newExpense);

  // abhi sirf verify kar rahe
  // later yahin API call hogi

  setOpen(false);
};

  

  if (!group) {
    return (
      <div className="group-detail-empty">Select a group to see details</div>
    );
  }

  

const expenses = group.expenses ?? [];
const sortedExpenses = sortByDate(expenses);

  let lastLabel = null;

  return (
    <div className="group-detail">
      {/* HEADER */}
      <div className="group-chat-header">

         <button
    className="group-back-btn"
    onClick={onBack}
  >
    <RiArrowLeftCircleLine size={28}/>
  </button>
        <div className="group-header-info"  onClick={onOpenInfo}>
          
          
          <h2>{group.name}</h2>
          <span>{group.members?.length || 0} members</span>
        </div>

        
      </div>

      {/* CHAT BODY */}

      <div className="group-chat-body">
        {sortedExpenses.map((expense) => {
          const label = getDayLabel(expense.createdAt);

          const showLabel = label !== lastLabel;

          lastLabel = label;

          const isOutgoing = expense.paidBy === CURRENT_USER_ID;

          return (
            <React.Fragment key={expense._id}>
              {showLabel && <div className="chat-date-separator">{label}</div>}

              <div
                className={`chat-message ${
                  isOutgoing ? "outgoing" : "incoming"
                }`}
              >
                <p>{activityFormatter(expense, group, CURRENT_USER_ID)}</p>

                <span>{formatTime(expense.createdAt)}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="group-chat-footer">
        <button className="chat-secondary-btn">Settle</button>

        <button className="chat-primary-btn" onClick={()=>setOpen(true)}>Add Expense</button>
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
