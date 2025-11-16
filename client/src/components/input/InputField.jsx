import React, { useState } from "react";
import { HiEye, HiEyeOff, HiX } from "react-icons/hi";
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
  rows = 6,
  step,
  error,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const { lang } = useSelector((state) => state.lang) || defaultLangState;

  const inputClasses = `
    w-full p-3 border-b-2 border-[#185D86] rounded-md
    focus:outline-dashed focus:outline-2 focus:outline-[#185D86] 
    transition-all duration-200 bg-white text-[#12254D] placeholder-[#8CA6B8]
    focus:bg-[#E5F3FB]
    ${disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}
  `;

  const getInputType = () =>
    type === "password" && showPassword ? "text" : type;

  const eyePosition = lang === "ar" ? "left-0 pl-3" : "right-0 pr-3";

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await convertToBase64(file);
    setPreview(base64);
    onChange({ target: { name, value: base64 } });
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    setPreview(null);
    onChange({ target: { name, value: "" } });
  };

  return (
    <div className={`w-full mb-4 ${className}`}>
      <label className="block text-sm font-bold mb-2 text-[#12254D]">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          disabled={disabled}
          className={inputClasses}
        />
      ) : type === "image" ? (
        <div className="space-y-3">
          {preview ? (
            <div className="relative w-full h-40 border border-[#185D86] rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
                >
                  <HiX size={18} />
                </button>
              )}
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#185D86] rounded-lg ${
                disabled
                  ? "opacity-60 cursor-not-allowed bg-gray-100"
                  : "cursor-pointer bg-[#F8FAFC] hover:bg-[#E5F3FB]"
              } transition`}
            >
              <span className="text-sm text-[#185D86] text-center">
                {disabled ? "Upload disabled" : "Click to upload"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={disabled}
              />
            </label>
          )}
        </div>
      ) : (
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
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 flex items-center ${eyePosition} pr-3`}
              disabled={disabled}
            >
              {showPassword ? (
                <HiEyeOff size={20} className="text-[#185D86]" />
              ) : (
                <HiEye size={20} className="text-[#185D86]" />
              )}
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
