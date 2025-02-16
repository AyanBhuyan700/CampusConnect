import React from "react";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="container-fluid py-5 bg-light">
      {/* Hero Section */}
      <div className="container text-center">
        <h1 className="display-3 fw-bold text-primary mb-4">
          Welcome to <span className="text-info">CampusConnect</span>
        </h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: "800px" }}>
          Your gateway to discovering top universities and academic programs worldwide. Whether you're a student searching for the right university
          or an institution looking to connect with aspiring learners, we've got you covered.
        </p>

        {/* Call to Action */}
        <div className="mt-4">
          <Link to="/university" className="btn btn-lg btn-info fw-bold px-5 py-3 shadow-sm">
            Explore Universities
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mt-5">
        <div className="row text-center">
          {/* Feature 1 */}
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm p-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2554/2554969.png"
                width="90"
                height="90"
                alt="University Icon"
                className="mx-auto"
              />
              <h4 className="mt-3 text-info">Find Universities</h4>
              <p className="text-muted">
                Explore a comprehensive list of universities based on your preferences and needs.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm p-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2010/2010853.png"
                width="90"
                height="90"
                alt="Courses Icon"
                className="mx-auto"
              />
              <h4 className="mt-3 text-info">Compare Courses</h4>
              <p className="text-muted">
                Compare different programs, courses, and specializations to make the right choice.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm p-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3175/3175190.png"
                width="90"
                height="90"
                alt="Community Icon"
                className="mx-auto"
              />
              <h4 className="mt-3 text-info">Connect & Apply</h4>
              <p className="text-muted">
                Connect with universities, apply directly, and start your academic journey today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mt-5 text-center">
        <h2 className="fw-bold text-info">What Students Say</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4">
              <p className="text-muted fst-italic">
                "CampusConnect made it so easy to find the perfect university for my needs!"
              </p>
              <h6 className="fw-bold text-secondary">- Sarah L.</h6>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4">
              <p className="text-muted fst-italic">
                "The comparison feature helped me choose the best program for my career goals."
              </p>
              <h6 className="fw-bold text-secondary">- James M.</h6>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4">
              <p className="text-muted fst-italic">
                "I love how easy it is to apply directly to universities through this platform."
              </p>
              <h6 className="fw-bold text-secondary">- Emily R.</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Final Call-to-Action */}
      <div className="container text-center mt-5">
        <h3 className="fw-bold text-primary">Start Your Journey Today!</h3>
        <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
          Discover, compare, and apply to the best universities around the world with just a few clicks.
        </p>
        <Link to="/register" className="btn btn-lg btn-success fw-bold px-5 py-3 mt-3 shadow-sm">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Main;