import React from "react";
import { FaRegCalendarAlt, FaNewspaper } from "react-icons/fa";

const LatestNews = () => {
  const news = [
    {
      title: "First Batch of Students Funded",
      date: "October 28, 2025",
      excerpt:
        "We are thrilled to announce that our first group of students has been fully funded for the upcoming academic year.",
    },
    {
      title: "New Donor Partnerships",
      date: "October 15, 2025",
      excerpt:
        "Agosh Care Center is proud to partner with three new corporate donors to expand our reach and support more students.",
    },
    {
      title: "Success Story: A Student's Journey",
      date: "October 02, 2025",
      excerpt:
        "Read about how a scholarship from one of our donors transformed a young student's life and educational opportunities.",
    },
  ];

  return (
    <section className="bg-orange-50 py-16">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Latest News
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Stay updated with the latest news, events, and success stories from
            the Agosh Care Center community.
          </p>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <FaNewspaper className="text-orange-600 text-2xl" />
                <div className="flex items-center text-gray-500 text-sm">
                  <FaRegCalendarAlt className="mr-2" />
                  {item.date}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">{item.excerpt}</p>
              <a
                href="#"
                className="text-orange-600 font-medium hover:underline mt-auto"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
