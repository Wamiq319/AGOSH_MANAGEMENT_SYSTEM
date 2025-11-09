import React from "react";
import { FaUserPlus, FaSearch, FaHeart } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Register",
    text: "Create your donor or student account in minutes.",
    icon: <FaUserPlus className="text-5xl text-orange-500" />,
  },
  {
    id: 2,
    title: "Find a Match",
    text: "Browse profiles to find a student or a donor that aligns with your goals.",
    icon: <FaSearch className="text-5xl text-orange-500" />,
  },
  {
    id: 3,
    title: "Make a Difference",
    text: "Make a secure donation or receive the funding you need for your education.",
    icon: <FaHeart className="text-5xl text-orange-500" />,
  },
];

const Process = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            A Simple Path to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              {" "}
              Giving
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our process is designed to be simple, transparent, and effective for
            both donors and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center p-8"
            >
              <div className="flex items-center justify-center h-24 w-24 mb-6">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
