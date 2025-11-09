import React from "react";
import { Navbar, Footer } from "../../components";
import {
  Hero,
  Process,
  WhyChooseUs,
  Testimonials,
  LatestNews,
} from "@/sections";
import { CTA } from "@/components";

const ctaData = {
  title: "Ready to Make a Difference?",
  description:
    "Join our community of donors and students and help us build a brighter future, one student at a time.",
  buttonText: "Get Started Today",
  buttonLink: "/register",
  gradientFrom: "orange-600",
  gradientTo: "orange-400",
  buttonVariant: "filled",
  buttonColor: "orange",
  rounded: true,
};

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Process />
      <WhyChooseUs />
      <Testimonials />
      <LatestNews />
      <CTA data={ctaData} />
      <Footer />
    </div>
  );
};

export default LandingPage;
