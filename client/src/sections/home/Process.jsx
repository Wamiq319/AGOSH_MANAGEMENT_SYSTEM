import React from "react";
import { FaUserPlus, FaSearch, FaPaperPlane } from "react-icons/fa";

const steps = [
  {
    id: 1,
    text: "Register and create your profile.",
    icon: <FaUserPlus className="text-5xl text-white" />,
  },
  {
    id: 2,
    text: "Search and explore available scholarships.",
    icon: <FaSearch className="text-5xl text-white" />,
  },
  {
    id: 3,
    text: "Apply online and submit your documents.",
    icon: <FaPaperPlane className="text-5xl text-white" />,
  },
];

const Process = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Application{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
              Process
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to apply for scholarships quickly and
            easily.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-8 relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-24 w-24 flex items-center justify-center shadow-lg mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Step {step.id}
                </h3>
                <p className="text-gray-600">{step.text}</p>
              </div>
              {index !== steps.length - 1 && (
                <div className="hidden md:block h-1 w-20 bg-yellow-400 rounded-full"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
