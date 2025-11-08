import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      field: "Computer Science",
      quote:
        "Scholarship Zone helped me find the perfect scholarship to fund my studies. I am very grateful!",
    },
    {
      name: "Jane Smith",
      field: "Engineering",
      quote:
        "The application process was so easy and straightforward. I highly recommend this platform.",
    },
    {
      name: "Sam Wilson",
      field: "Medical Sciences",
      quote:
        "I found a scholarship that I never would have known about otherwise. Thank you, Scholarship Zone!",
    },
    {
      name: "Emily White",
      field: "Business Administration",
      quote:
        "The personalized matches were incredibly accurate. It saved me so much time!",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
              Users Say
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from students who have successfully used our platform to achieve
            their dreams.
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-lg h-full flex flex-col">
                <FaQuoteLeft className="text-blue-200 text-4xl mb-4" />
                <p className="text-gray-700 italic mb-6 leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-800">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-blue-600">{testimonial.field}</p>
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
