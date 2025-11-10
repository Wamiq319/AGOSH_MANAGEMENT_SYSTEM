import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const toastTypes = {
  success: {
    icon: <FaCheckCircle />,
    style: "bg-green-100 text-green-700 border-green-300",
  },
  error: {
    icon: <FaExclamationCircle />,
    style: "bg-red-100 text-red-700 border-red-300",
  },
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  if (!message) return null;

  const { icon, style } = toastTypes[type] || toastTypes.error;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center justify-between p-4 rounded-lg shadow-lg border max-w-sm animate-fade-in-down ${style}`}
    >
      <div className="flex items-center">
        <span className="text-xl mr-3">{icon}</span>
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-lg">
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
