import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import LandingNavbar from '../components/LandingNavbar'; // Import LandingNavbar component
import Typewriter from 'typewriter-effect'; // Import Typewriter
import '../index.css'; // Importing the CSS
import Image from "../images/Home_Image.png"; // Assuming the image is located here

const LandingPage = () => {
  useEffect(() => {
    console.log('Landing page loaded');
  }, []); // Empty dependency array means it runs only on mount

  return (
    <div className="landing-page">
      {/* Landing Navbar */}
      <LandingNavbar />

      {/* Content Section */}
      <div className="content">
        <div className="text">
          <h1>
            <span style={{ color: "skyblue" }}>Opti</span>mize your work
            <span style={{ color: "skyblue" }}>flow</span> with <br />
            <strong style={{ fontSize: "80px", color: "#00bfff" }}>OptiFlow</strong>
          </h1>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            The best platform for project management, task organization, and team collaboration.
          </p>
          <div className="typewriter-wrapper">
            <Typewriter
              options={{
                strings: [
                  "Project Management",
                  "Team Collaboration",
                  "Employee Recommendation",
                ],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </div>
          <div className="cta">
            <Link to="/login">
              <button className="cta-button">Login</button>
            </Link>
            <Link to="/signup">
              <button className="cta-button">Sign Up</button>
            </Link>
          </div>
        </div>

        <div className="image">
          <img src={Image} alt="Workflow optimization" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
