import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div id="fullpage">
      <Navbar currentSubsite={"about"} />
      <section className="meet alexaHenry">
        <img
          className="photo right"
          src={require("../images/alexaAndHenry.png")}
          alt=""
        ></img>
        <h1 className="heading">Meet Alexa and Henry</h1>
        <p className="body">Hello, we are the creators of Mescolare!</p>
      </section>
      {/* <section className="meet henry">
        <img className="photo left" src={require("../images/henrypic.png")} alt=""></img>
        <h1 className="heading left">Get to know Henry</h1>
        <p className="body left">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </section>
      <section className="meet alexa">
        <img className="photo right" src={require("../images/alexapic.png")} alt=""></img>
        <h1 className="heading">Get to know Alexa</h1>
        <p className="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </section> */}
      <section className="meet tuna">
        <img
          className="photo left"
          src={require("../images/tunapic.png")}
          alt=""
        ></img>
        <h1 className="heading left">Get to know Tuna</h1>
        <p className="body left">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </section>
      <Footer />
    </div>
  );
}
