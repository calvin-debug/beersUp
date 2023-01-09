import React from "react";
import BeerButton from "./beerButton";

const Beer = ({ id, name, brand, alcohol, added, onBeerStateChange }) => {
  return (
    <div className="beer">
      <div className="beer-info">
        <h4 className="beer-name">{name}</h4>
        <span className="beer-brand">{brand} | </span>
        <span className="beer-alcohol">{alcohol}</span>
      </div>
      <div className="beer-buttons">
        <BeerButton
          beerId={id}
          added={added}
          onBeerStateChange={onBeerStateChange}
        />
      </div>
    </div>
  );
};

export default Beer;
