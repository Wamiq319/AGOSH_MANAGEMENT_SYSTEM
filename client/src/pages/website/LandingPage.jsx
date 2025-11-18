import React from "react";
import Logo from "@/assets/LOGO.png";
import { Navbar, Footer } from "../../components";
import { Button } from "@/components";

// ---------------------- COMPONENTS ----------------------

// HERO SECTION
const HeroSection = () => (
  <section className="bg-gradient-to-br from-orange-500 to-blue-600 text-white py-20 px-6">
    <div className="max-w-6xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <img src={Logo} alt="Agosh System" className="w-28 h-auto" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
        Support Students Across Pakistan
      </h1>

      <p className="text-lg mt-4 max-w-2xl mx-auto text-blue-100">
        Agosh connects generous donors with deserving students. Donate
        externally and upload proof of your donation to make a real impact in
        education.
      </p>

      <Button
        rounded
        color="gold"
        className="mt-8 px-8 py-4 text-lg shadow-lg"
        onClick={() => (window.location.href = "/upload-donation")}
      >
        Upload Donation Proof
      </Button>
    </div>
  </section>
);

// FEATURES SECTION
const FeaturesSection = () => {
  const features = [
    {
      title: "Verified Students",
      desc: "We carefully verify every student to ensure your support goes to genuine recipients.",
      icon: "🎓",
    },
    {
      title: "Transparent Process",
      desc: "Upload donation screenshots and track student progress with full clarity.",
      icon: "📊",
    },
    {
      title: "Nationwide Impact",
      desc: "Your contributions reach students from all corners of Pakistan.",
      icon: "🇵🇰",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center font-bold text-blue-700 mb-12">
          Why Support Students Through Agosh?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md border border-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="text-xl font-semibold mt-4 text-orange-600">
                {f.title}
              </h3>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// PROCESS SECTION
const ProcessSection = () => {
  const steps = [
    {
      title: "Register",
      desc: "Create your donor account in minutes.",
      icon: "📝",
    },
    {
      title: "Select a Student",
      desc: "Browse verified students and choose one to support.",
      icon: "🎯",
    },
    {
      title: "Donate Externally",
      desc: "Transfer donation via bank, Easypaisa, or other methods.",
      icon: "💸",
    },
    {
      title: "Upload Screenshot",
      desc: "Upload proof of your donation for verification.",
      icon: "📷",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-5 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="text-5xl">{step.icon}</div>
              <h3 className="text-xl font-semibold mt-4 text-orange-600">
                {step.title}
              </h3>
              <p className="text-gray-600 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA SECTION
const CTASection = () => (
  <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 px-6 text-white text-center">
    <h2 className="text-4xl font-extrabold">Make a Difference Today</h2>
    <p className="mt-4 text-lg max-w-xl mx-auto">
      Support a student by donating externally and uploading proof of your
      donation. Empower education and build brighter futures across Pakistan.
    </p>
    <Button
      rounded
      color="gold"
      className="mt-8 text-lg px-8 py-4"
      onClick={() => (window.location.href = "/upload-donation")}
    >
      Upload Donation Proof
    </Button>
  </section>
);

// ---------------------- MAIN PAGE ----------------------

const LandingPage = () => {
  return (
    <div className="w-full overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
