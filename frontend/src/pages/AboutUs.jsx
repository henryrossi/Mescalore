import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div id="fullpage">
      <Navbar currentSubsite={"about"} />
      <div className="about-us-container">
        <div className="alexa-henry-card">
          <img src={require("../images/alexaAndHenry.png")} alt="" />
          <h1>Meet Alexa and Henry</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="tuna-card">
          <img src={require("../images/tunapic.png")} alt="" />
          <h1>Meet Tuna</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
