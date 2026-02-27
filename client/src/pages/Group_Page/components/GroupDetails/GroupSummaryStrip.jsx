import React from 'react'
import "./GroupSummaryStrip.css"

function GroupSummaryStrip() {
  return (
    <div className='group-summary-strip'>
      <div className="summary-item">
        <span className="summary-label">My Expense</span>
        <span className="summary-value">₹700</span>
      </div>
      <div className="summary-divider" />

      <div className="summary-item">
        <span className="summary-label">Total Expense</span>
        <span className="summary-value">₹10000</span>
      </div>

    </div>
  )
}

export default GroupSummaryStrip