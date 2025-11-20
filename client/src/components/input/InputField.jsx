import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useSelector } from "react-redux";

const defaultLangState = { lang: "en", words: { ui: {} } };

const InputField = ({
  required = true,
  label,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  type = "text",
  step,
  error,
  disabled = false,
  ...props // allow extra props without breaking
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { lang } = useSelector((state) => state.lang) || defaultLangState;

  const inputClasses = `
    w-full p-3 border border-blue-500 rounded-md
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200 bg-white text-[#12254D] placeholder-blue-300
    ${disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}
  `;

  const getInputType = () =>
    type === "password" && showPassword ? "text" : type;

  const eyePosition = lang === "ar" ? "left-0 pl-3" : "right-0 pr-3";

  return (
    <div className={`w-full mb-4 ${className}`}>
      <label className="block text-sm font-semibold mb-2 text-blue-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="relative">
        <input
          type={getInputType()}
          name={name}
          placeholder={placeholder}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 flex items-center ${eyePosition}`}
            disabled={disabled}
          >
            {showPassword ? (
              <HiEyeOff size={20} className="text-blue-500" />
            ) : (
              <HiEye size={20} className="text-blue-500" />
            )}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;

