import React from "react";
import { FaCheckCircle, FaDatabase, FaUserGraduate } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Easy to Use",
      description:
        "Our platform is designed to be intuitive and simple to navigate.",
      icon: <FaCheckCircle className="text-5xl text-blue-500" />,
    },
    {
      title: "Comprehensive Database",
      description:
        "Access a vast database of scholarships from various sources.",
      icon: <FaDatabase className="text-5xl text-purple-500" />,
    },
    {
      title: "Personalized Matches",
      description:
        "Our smart algorithm delivers tailored scholarship recommendations.",
      icon: <FaUserGraduate className="text-5xl text-yellow-500" />,
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
              Choose Us?
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We provide the best tools and resources to help you succeed in your
            scholarship search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
