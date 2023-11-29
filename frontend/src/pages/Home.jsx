import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconPencilPlus, IconLogout } from "@tabler/icons-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
import "@fontsource/jua";

function Home() {
  const [loggedIn, setAuthorization] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    // To be secure I believe I should also remove the Token from the backend database
    localStorage.removeItem("token");
    setAuthorization(null);
  };

  return (
    <div id="fullpage">
      <Navbar currentSubsite={"home"} />
      <hgroup className="hgroup">
        <h1 className="title">mescolare!</h1>
        <p className="desc">
          a collaborative project between two people who love food
        </p>
      </hgroup>
      {loggedIn && (
        <div>
          <Link to="/create" className="createLink">
            <IconPencilPlus />
          </Link>
          <button onClick={handleLogout} className="logOutButton">
            <IconLogout />
          </button>
        </div>
      )}
      <img
        className="home-drawing"
        src={require("../images/hotcouple.png")}
        alt=""
      />
      <article className="article">
        <img
          className="article-img"
          src={require("../images/kitchen.png")}
          alt=""
        />
        <h2 className="article-title">
          Our homebase for all of our favorite recipes we love to make with
          eachother.
        </h2>
        <p className="article-text">
          As you journey through our kitchen we hope these recipes bring as much
          joy to you as they do to us. We welcome you to explore our website,
          discover whole new tastes and cuisines, and let the cooking adventures
          begin!
        </p>
      </article>
      <Footer />
    </div>
  );
}

export default Home;
