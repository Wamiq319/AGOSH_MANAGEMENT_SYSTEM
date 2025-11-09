import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Donor",
      quote:
        "Agosh Care Center has made it so easy to give back. I'm proud to support the next generation of leaders.",
    },
    {
      name: "Maria Garcia",
      role: "Student",
      quote:
        "Thanks to a generous donor on this platform, I can now afford my tuition. I am forever grateful.",
    },
    {
      name: "David Chen",
      role: "Donor",
      quote:
        "I've always wanted to support education, and Agosh provides a transparent and impactful way to do it.",
    },
    {
      name: "Sarah Lee",
      role: "Student",
      quote:
        "The application process was simple, and I was matched with a donor who believed in my dreams.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Stories of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Impact
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from the donors and students who have been a part of our
            community.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-8 rounded-xl shadow-lg h-full flex flex-col text-white">
                <FaQuoteLeft className="text-orange-200 text-4xl mb-4" />
                <p className="italic mb-6 leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="text-right">
                  <p className="text-lg font-bold">{testimonial.name}</p>
                  <p className="text-sm text-orange-100">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
