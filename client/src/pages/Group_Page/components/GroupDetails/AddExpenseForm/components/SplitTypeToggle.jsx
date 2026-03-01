/**
 * SplitTypeToggle
 * -----------------
 * Controls the UI toggle between:
 * - Equal split
 * - Unequal split
 *

 */
function SplitTypeToggle({ splitType, setFormInput }) {
  return (
    <div className="split-header">
      <p>Split Between</p>

      <div className="split-type-inline">
        <span
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
        </span>

        <span
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
        </span>
      </div>
    </div>
  );
}

export default SplitTypeToggle;