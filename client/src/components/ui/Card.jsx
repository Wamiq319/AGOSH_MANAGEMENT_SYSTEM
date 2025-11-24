const Card = ({ item, fields, actions, headerIcon }) => {
  const getValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], obj);

  const branchName = item.title || item.name || "Untitled Branch";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      
      {/* Header Section with Dynamic Icon */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
        <div className="text-white text-5xl opacity-80">
          {headerIcon /* Dynamic icon from parent */}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{branchName}</h2>

        {/* Dynamic Fields */}
        <div className="space-y-3 mb-6 text-gray-600">
          {fields.map(({ key, icon }, index) => (
            <div key={index} className="flex items-start">
              <span className="mt-1 mr-3 text-xl">{icon}</span>
              <span className="break-word">{getValue(item, key) || "N/A"}</span>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.onClick(item)}
              className={
                action.label === "Donate"
                  ? "flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                  : "flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              }
            >
              {action.label}
              {action.icon && <span>{action.icon}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
