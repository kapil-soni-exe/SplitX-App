import React, { useState } from "react";
import { RiAddLine, RiFileTextLine } from "@remixicon/react";

/**
 * ExpenseBasicInfo
 * -----------------
 * Hero section for Title & Amount, plus collapsible Description note.
 */
function ExpenseBasicInfo({ formInput, setFormInput }) {
  const [showNote, setShowNote] = useState(Boolean(formInput.description));

  return (
    <div className="expense-basic-info">
      {/* HERO SECTION: Title & Amount */}
      <div className="expense-hero-card">
        <div className="hero-title-field">
          <input
            id="expense-title"
            type="text"
            className="hero-title-input"
            placeholder="What's this for?"
            value={formInput.title}
            onChange={(e) =>
              setFormInput((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
        </div>

        <div className="hero-amount-field">
          <span className="currency-symbol">₹</span>
          <input
            id="expense-amount"
            type="number"
            className="hero-amount-input"
            placeholder="0"
            value={formInput.amount}
            onChange={(e) =>
              setFormInput((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* COLLAPSIBLE DESCRIPTION */}
      <div className="description-collapsible">
        {!showNote ? (
          <button
            type="button"
            className="add-note-btn"
            onClick={() => setShowNote(true)}
          >
            <RiAddLine size={16} />
            <span>Add a note</span>
          </button>
        ) : (
          <div className="form-field">
            <label htmlFor="expense-description">
              <RiFileTextLine
                size={14}
                style={{ verticalAlign: "middle", marginRight: "4px" }}
              />
              Note (optional)
            </label>
            <textarea
              id="expense-description"
              className="form-textarea"
              rows={2}
              placeholder="Add details..."
              value={formInput.description}
              onChange={(e) =>
                setFormInput((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseBasicInfo;