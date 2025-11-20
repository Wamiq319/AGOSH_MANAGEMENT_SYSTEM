import React from "react";

const TextArea = ({
  required = true,
  label,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  rows = 6,
  error,
  disabled = false,
  ...props
}) => {
  const inputClasses = `
    w-full p-3 border border-blue-500 rounded-md
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200 bg-white text-[#12254D] placeholder-blue-300
    ${disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}
  `;

  return (
    <div className={`w-full mb-4 ${className}`}>
      <label className="block text-sm font-semibold mb-2 text-blue-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextArea;
