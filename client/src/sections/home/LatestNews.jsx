import React from "react";
import { FaRegCalendarAlt, FaNewspaper } from "react-icons/fa";

const LatestNews = () => {
  const news = [
    {
      title: "New Scholarship for STEM Students",
      date: "September 24, 2025",
      excerpt:
        "A brand-new scholarship program has been announced for students pursuing STEM fields. Applications are now open.",
    },
    {
      title: "Application Deadlines Approaching",
      date: "September 20, 2025",
      excerpt:
        "Several scholarships are nearing their deadlines this month. Don’t miss your chance to apply before it’s too late.",
    },
    {
      title: "Tips for a Winning Scholarship Essay",
      date: "September 15, 2025",
      excerpt:
        "Learn how to write a compelling scholarship essay that highlights your strengths and sets you apart from others.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700">
            Latest News
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Stay updated with the newest opportunities, tips, and important
            scholarship announcements.
          </p>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition border-t-4 border-yellow-400 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <FaNewspaper className="text-blue-600 text-2xl" />
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
                className="text-blue-600 font-medium hover:underline mt-auto"
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
