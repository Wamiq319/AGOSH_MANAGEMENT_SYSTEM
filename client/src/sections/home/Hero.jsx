import React from "react";
import { Button } from "@/components";

const Hero = () => {
  return (
    <div className="relative h-screen w-full bg-white flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100/70 to-white"></div>
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-gray-800 drop-shadow-lg">
          Connecting Donors to
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            {" "}
            Future Leaders
          </span>
        </h1>
        <p className="text-lg md:text-xl mb-6 text-gray-600">
          Agosh Care Center is a platform that connects generous donors with
          bright, deserving students to make education accessible for all.
        </p>
        <Button
          color="orange"
          variant="filled"
          rounded
          className="text-lg px-8 py-3"
        >
          Become a Donor
        </Button>
      </div>
    </div>
  );
};

export default Hero;
