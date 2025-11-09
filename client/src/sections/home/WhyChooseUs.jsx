import React from "react";
import { FaHandHoldingHeart, FaUserCheck, FaBullseye } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Transparent Donations",
      description:
        "Our platform ensures that your donations go directly to the students you choose to support.",
      icon: <FaHandHoldingHeart className="text-5xl text-orange-500" />,
    },
    {
      title: "Verified Students",
      description:
        "We verify every student's eligibility to ensure that your contributions make a real difference.",
      icon: <FaUserCheck className="text-5xl text-orange-500" />,
    },
    {
      title: "Direct Impact",
      description:
        "See the direct impact of your generosity and follow the progress of the students you sponsor.",
      icon: <FaBullseye className="text-5xl text-orange-500" />,
    },
  ];

  return (
    <section className="bg-orange-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Why Choose
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              {" "}
              Agosh?
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to creating a trustworthy and effective platform
            for connecting donors and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-orange-100 border-t-4 border-t-orange-500"
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
