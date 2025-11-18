import React from "react";
import clsx from "clsx";

const Button = ({
  children,
  onClick,
  type = "button",

  color = "blue",

  className = "",
  disabled = false,

  ...rest // accept all extra old props safely
}) => {
  const baseStyles =
    "px-5 py-3 font-semibold text-sm md:text-base transition-all duration-200 select-none cursor-pointer shadow-sm active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-1";

  // Always slight rounding (Pakistani design)
  const shape = "rounded-lg";

  // Backward compatible color mapping
  // Even if old code passes: white, outline, variant, etc.
  const colorMap = {
    blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    orange:
      "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500",
    red: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

    // fallback colors because old code used these:
    white: "bg-white text-blue-700 border border-blue-600 hover:bg-blue-50",
    yellow: "bg-yellow-500 text-white hover:bg-yellow-600",
    green: "bg-green-600 text-white hover:bg-green-700",
  };

  const appliedColor = colorMap[color] || colorMap.blue; // safe fallback

  const disabledStyles =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";

  const classes = clsx(
    baseStyles,
    shape,
    appliedColor,
    disabledStyles,
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      {...rest} // pass extra props to avoid breaking older code
    >
      {children}
    </button>
  );
};

export default Button;
