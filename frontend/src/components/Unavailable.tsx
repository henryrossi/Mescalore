import * as React from "react";
import { Link } from "react-router-dom";
import "./Unavailable.css";

export default function Unavailable() {
  return (
    <div className="flex-col container__unavailable">
      <p className="jua text-3xl">Sorry, this page is unavailable</p>
      <Link className="text-base blue" to="/">
        Click here to return to the Home page
      </Link>
    </div>
  );
}
