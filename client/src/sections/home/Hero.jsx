import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "@/components";
import heroBg1 from "../../assets/hero/hero-bg-1.jpeg";
import heroBg2 from "../../assets/hero/hero-g-2.jpeg";

const Hero = () => {
  const slides = [
    {
      bgImage: heroBg1,
      title: (
        <>
          Unlock Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Future
          </span>{" "}
          <br /> with Scholarships
        </>
      ),
      subtitle:
        "Discover funding opportunities tailored to your education goals and build a brighter tomorrow.",
      buttonText: "Browse Scholarships",
    },
    {
      bgImage: heroBg2,
      title: (
        <>
          Simple{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Applications
          </span>
          , <br /> Big Opportunities
        </>
      ),
      subtitle:
        "Our platform simplifies scholarship management for students and universities alike.",
      buttonText: "Start Applying",
    },
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 6000 }}
      loop
      className="h-screen"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="relative h-full w-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-purple-900/50"></div>
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-200">
                {slide.subtitle}
              </p>
              <Button color="gold" variant="filled" rounded className="text-lg px-8 py-3">
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Hero;
