import React from "react";
import clsx from "clsx";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "filled", // "filled" | "outline"
  color = "blue", // "blue" | "orange" | "white"
  rounded = true, // true = pill, false = small rounded
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-6 py-2.5 font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer";

  const shape = rounded ? "rounded-full" : "rounded-md";

  const variants = {
    filled: {
      blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      orange:
        "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500",
      white:
        "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    },
    outline: {
      blue: "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500",
      orange:
        "bg-transparent text-orange-600 border border-orange-600 hover:bg-orange-50 focus:ring-orange-500",
      white:
        "bg-transparent text-white border border-white hover:bg-white hover:text-blue-600 focus:ring-white",
    },
  };

  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";

  const classes = clsx(
    baseStyles,
    shape,
    variants[variant][color],
    disabledStyles,
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
