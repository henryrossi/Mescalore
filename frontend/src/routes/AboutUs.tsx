import * as React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-us-container">
      <div className="alexa-henry-card">
        <img src={require("../images/alexaAndHenry.png")} alt="" />
        <h1>Meet Alexa and Henry</h1>
        <p>
          We build this website to create a space that combines our passion
          for food and coding with our passion for each other. It has been
          wonderful to be able to share this expressive, fun part of ourselves
          with our friends, family, and many others.
        </p>
      </div>
      <div className="tuna-card">
        <img src={require("../images/tunapic.png")} alt="" />
        <h1>Meet Tuna</h1>
        <p>
          Tuna Bear oversees kitchen operations to ensure that all recipes are
          up to her very high standards in terms of flavor, quality, and
          simplicity. Tempers often flare in the kitchen as Tuna is known to
          leave her mark if she has deemed the recipe subpar.
        </p>
      </div>
    </div>
  );
}
