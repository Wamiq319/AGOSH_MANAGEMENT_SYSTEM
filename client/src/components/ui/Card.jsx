import React, { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components";

const Card = ({ item, fields, actions }) => {
  const [expanded, setExpanded] = useState(false);

  const getValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], obj);

  const calculateDaysLeft = (date) => {
    if (!date) return 0;
    return Math.max(
      0,
      Math.ceil(
        (new Date(date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
  };

  return (
    <div className="relative w-full h-fit bg-white rounded-2xl p-6 shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <h3
          className="relative w-fit bg-gradient-to-r from-blue-600 to-orange-500 p-4 sm:px-8 pr-6 sm:pr-16 py-3 text-base md:text-lg font-bold text-white shadow-md"
          style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)" }}
        >
          {item.title || "Untitled"}
        </h3>

        {item.status && (
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              item.status === "active"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-orange-100 text-orange-700 border-orange-300"
            }`}
          >
            {item.status === "active" ? "Active" : "Inactive"}
          </span>
        )}
      </div>

      <ul className="mt-5 ml-2 space-y-3 text-gray-700 text-sm">
        {fields.map(({ key, label, icon }) => {
          const Icon = Icons[icon];
          let value = getValue(item, key);

          if (key === "deadline" && value)
            value = new Date(value).toLocaleDateString();
          if (Array.isArray(value)) value = value.join(", ");
          if (value === undefined || value === null) value = "N/A";

          return (
            <li key={key} className="flex items-center gap-3">
              {Icon && <Icon className="w-5 h-5 text-blue-500" />}
              <span className="font-semibold text-gray-800">{label}:</span>
              <span className="text-gray-700">{value}</span>
            </li>
          );
        })}
      </ul>

      {item.description && (
        <div className="relative ml-2 mt-4">
          <p
            className={`text-gray-700 transition-all duration-300 ${
              expanded ? "line-clamp-none" : "line-clamp-2"
            }`}
          >
            {item.description}
          </p>
          {item.description.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 mt-1 font-semibold hover:underline text-sm"
            >
              {expanded ? "See Less" : "See More"}
            </button>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
        {actions.map((action, index) => {
          if (action.type === "text") {
            let value = getValue(item, action.valueKey);
            if (action.format === "daysLeft") value = calculateDaysLeft(value);
            return (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">
                  {action.label}:
                </span>
                <span className="text-orange-600 font-bold text-lg">
                  {value}
                </span>
              </div>
            );
          }

          if (action.type === "button") {
            return (
              <Button
                key={index}
                onClick={() => action.onClick(item)}
                variant="filled"
                color="blue"
                className="flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <span>{action.label}</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </Button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default Card;
