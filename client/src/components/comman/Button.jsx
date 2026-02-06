
import { Children } from "react";
import "./Button.css";

export default function Button({
  text = "",
  onClick,
  type = "button",
  className="",
  variant = "primary",
  disabled = false,
  children
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {text} {children}
    </button>
  );
}
