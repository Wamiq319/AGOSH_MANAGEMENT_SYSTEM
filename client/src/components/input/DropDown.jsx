import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";

const Dropdown = ({
  required = true,
  label,
  options = [],
  selectedValue,
  onChange,
  className = "",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    onChange({ target: { value } });
    setIsOpen(false);
  };

  // Direct default string for English
  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "Select an option";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold mb-3 text-[#12254D]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer ${
          error ? "border-red-500" : "border-[#185D86]"
        } ${isOpen ? "ring-1 ring-[#185D86]/50" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="truncate text-[#12254D]">{selectedLabel}</span>
        {isOpen ? (
          <FaChevronUp className="h-4 w-4 text-[#185D86]" />
        ) : (
          <FaChevronDown className="h-4 w-4 text-[#185D86]" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg bg-white border border-[#185D86]/60 shadow-md max-h-36 overflow-y-auto scrollbar-hide animate-fadeIn">
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 flex justify-between items-center text-sm cursor-pointer transition-all ${
                  selectedValue === option.value
                    ? "bg-[#185D86] text-white"
                    : "hover:bg-[#E5F3FB] text-[#12254D]"
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {selectedValue === option.value && <FaCheck className="text-sm" />}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">No options available</div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
