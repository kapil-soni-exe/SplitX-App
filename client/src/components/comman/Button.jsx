import { Children } from "react";
import { motion } from "framer-motion";
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
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {text} {children}
    </motion.button>
  );
}
