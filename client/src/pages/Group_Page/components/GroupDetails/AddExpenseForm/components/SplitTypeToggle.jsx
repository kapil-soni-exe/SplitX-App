import React from "react";

/**
 * SplitTypeToggle
 * -----------------
 * Accessible toggle between Equal and Unequal split modes using <button type="button">
 */
function SplitTypeToggle({ splitType, setFormInput }) {
  return (
    <div className="split-header">
      <p>Split Between</p>

      <div className="split-type-inline">
        <button
          type="button"
          className={`split-option ${
            splitType === "EQUAL" ? "active" : ""
          }`}
          onClick={() =>
            setFormInput((prev) => ({
              ...prev,
              splitType: "EQUAL",
            }))
          }
        >
          Equal
        </button>

        <button
          type="button"
          className={`split-option ${
            splitType === "EXACT" ? "active" : ""
          }`}
          onClick={() =>
            setFormInput((prev) => ({
              ...prev,
              splitType: "EXACT",
            }))
          }
        >
          Unequal
        </button>
      </div>
    </div>
  );
}

export default SplitTypeToggle;