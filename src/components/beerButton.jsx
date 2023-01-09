import React from "react";

const BeerButton = ({ beerId, added, onBeerStateChange }) => {
  return (
    <React.Fragment>
      {added ? (
        <button
          onClick={() => onBeerStateChange(beerId, false)}
          className="btn-beer btn-beer-remove"
        >
          Spill
        </button>
      ) : (
        <button
          onClick={() => onBeerStateChange(beerId, true)}
          className="btn-beer btn-beer-add"
        >
          Fill
        </button>
      )}
    </React.Fragment>
  );
};

export default BeerButton;
