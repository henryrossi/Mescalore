import * as React from "react";
import "./Home.css";
import "@fontsource/jua"; // ???
import Couple from "../images/hotcouple.png";
import Kitchen from "../images/kitchen.png";
import authContext from "../authContext";

function Home() {

  return (
    <>
      <div className="main-container-home">
        <h1 className="text-6xl jua">mescolare!</h1>
        <p className="red text-xl">
          a collaborative project between two people who love food
        </p>
        <img
        className="couple-img-home"
          src={Couple}
          alt=""
        />
      </div>
      <div className="relative-positioned-home">
        <div className="bg-blue background-home">
          <div className="main-container-home">
            <div className="grid-home">
              <div className="grid-text-home">
                <h2 className="text-4xl yellow">
                  Our homebase for all of our favorite recipes we love to make with
                  eachother.
                </h2>
                <p className="white text-xl">
                  As you journey through our kitchen we hope these recipes bring as much
                  joy to you as they do to us. We welcome you to explore our website,
                  discover whole new tastes and cuisines, and let the cooking adventures
                  begin!
                </p>
              </div>
              <img
                className="grid-image-home"
                src={Kitchen}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
