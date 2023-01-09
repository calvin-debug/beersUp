import React from "react";

const Beer = ({ id, name, brand, alcohol, added, onBeerStateChange }) => {
  return (
    <div className="beer">
      <div className="beer-info">
        <h4 className="beer-name">{name}</h4>
        <span className="beer-brand">{brand} | </span>
        <span className="beer-alcohol">{alcohol}</span>
      </div>
      <div className="beer-buttons">
        {added ? (
          <button
            onClick={() => onBeerStateChange(id, false)}
            className="btn-beer btn-beer-remove"
          >
            Spill
          </button>
        ) : (
          <button
            onClick={() => onBeerStateChange(id, true)}
            className="btn-beer btn-beer-add"
          >
            Fill
          </button>
        )}
      </div>
    </div>
  );
};

export default Beer;
