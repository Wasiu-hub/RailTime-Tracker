// Landing.js
import React from "react";
import "../styles/Landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-card">
          <img
            src="landing-image.jpg"
            alt="RailTime App"
            className="landing-image"
          />
          <div className="landing-text">
            <p>
              RailTime Tracker provides timetable information for rail services,
              and provides data on the punctuality of those services.
            </p>
            <p>Use the search form above to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
