import React from 'react'
import "./Input.css"

function Input({
    label,
    id,
    type="text",
    placeholder="",
    value,
    onChange,
   className = "",
   disabled = false,
   ...props
}) {
  return (
    <div className="input-field">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input ${className}`}
        {...props}
      />
    </div>
  )
}

export default Input