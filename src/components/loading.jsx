import React from "react";
import BeerBottleSVG from "../utils/beerBottle.svg";
import "../stylesheets/loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="beer-icon">
        <img src={BeerBottleSVG} alt="loading" />
      </div>
    </div>
  );
};

export default Loading;
