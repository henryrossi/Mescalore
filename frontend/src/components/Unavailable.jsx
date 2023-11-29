import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Unavailable.css";

export default function Unavailable() {
  return (
    <div id="fullpage">
      <Navbar />
      <div className="unavailable">
        <p>Sorry, this page is unavailable</p>
        <Link to="/">Click here to return to the Home page</Link>
      </div>
    </div>
  );
}
