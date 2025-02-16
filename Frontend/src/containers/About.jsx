import React from "react";

function About() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-700">About Us</h1>
        <p className="text-lg text-gray-600 mt-3">
          Connecting students with the best universities worldwide.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
        <p className="text-lg text-gray-700">
          Welcome to <span className="font-semibold text-blue-700">CampusConnect</span>, your trusted platform for discovering universities and their departments.
          Whether you're a student, parent, or educator, we provide a{" "}
          <strong>comprehensive</strong> and <strong>reliable</strong> directory to help you make informed decisions.
        </p>
      </div>

      {/* Our Mission */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
          🎯 Our Mission
        </h2>
        <p className="text-lg text-gray-700 mt-3">
          Our mission is to <strong>bridge the gap between students and higher education institutions</strong> by providing an intuitive platform with{" "}
          <strong>accurate and up-to-date information</strong>. We aim to simplify the university search process and help students find the perfect institution that aligns with their goals.
        </p>
      </div>

      {/* What We Offer */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
          🎁 What We Offer
        </h2>
        <ul className="list-none text-lg text-gray-700 mt-4 space-y-3">
          <li>📚 <strong>A vast database</strong> of universities and departments worldwide.</li>
          <li>📖 Detailed insights on <strong>courses, faculty, tuition fees, and campus facilities</strong>.</li>
          <li>🔍 <strong>Smart search filters</strong> to help you find universities based on your preferences.</li>
          <li>🌎 <strong>User-friendly interface</strong> for seamless browsing.</li>
          <li>🆕 <strong>Regular updates</strong> to ensure <strong>accurate and fresh information</strong>.</li>
        </ul>
      </div>

      {/* Why Choose Us? */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
          ✅ Why Choose Us?
        </h2>
        <ul className="list-none text-lg text-gray-700 mt-4 space-y-3">
          <li>🎓 <span className="font-semibold">Comprehensive Listings:</span> Universities from across the world, all in one place.</li>
          <li>✅ <span className="font-semibold">Accurate & Verified Information:</span> We ensure all data is <strong>trustworthy and up to date</strong>.</li>
          <li>💡 <span className="font-semibold">User-Centric Experience:</span> Designed to be <strong>simple, interactive, and informative</strong>.</li>
          <li>🚀 <span className="font-semibold">Smart Filters:</span> Easily refine your search based on <strong>location, programs, rankings, and more</strong>.</li>
          <li>🔄 <span className="font-semibold">Continuous Improvement:</span> We constantly upgrade our platform with <strong>new features and insights</strong>.</li>
        </ul>
      </div>

      {/* Our Vision */}
      <div className="mt-12 bg-blue-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
          👁️ Our Vision
        </h2>
        <p className="text-lg text-gray-700 mt-3">
          We envision a world where students can access higher education opportunities <strong>easily and transparently</strong>.
          By leveraging <strong>technology and data</strong>, we strive to make university discovery <strong>simple, reliable, and accessible</strong> for everyone.
        </p>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-xl text-gray-700 font-semibold">
          <span className="text-blue-700">Explore, Compare, and Choose</span> the best university for your future!
        </p>
      </div>
    </div>
  );
}

export default About;
