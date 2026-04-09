import React from "react";
import "./EmptyState.css";
import Button from "./Button";

/**
 * Reusable EmptyState component for premium UI.
 * @param {Object} props
 * @param {string} props.title - Main heading.
 * @param {string} props.description - Subtext or explanation.
 * @param {string} props.image - Path to the illustration.
 * @param {Object} props.cta - Optional CTA object { text, onClick }.
 * @param {React.ReactNode} props.icon - Optional Lucide or Remix icon.
 */
function EmptyState({ title, description, cta, icon }) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        {icon && <div className="empty-state-icon">{icon}</div>}
        
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-description">{description}</p>
        
        {cta && (
          <Button
            text={cta.text}
            onClick={cta.onClick}
            variant="primary"
            className="empty-state-cta"
          />
        )}
      </div>
    </div>
  );
}

export default EmptyState;
