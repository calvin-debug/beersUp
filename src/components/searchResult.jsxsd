import React from "react";
import BeerButton from "./beerButton";

const SearchResult = ({ result, onBeerStateChange }) => {
  return (
    <div className="search-result">
      <p>
        {result.brand} - {result.name}
      </p>
      <BeerButton
        added={result.inOrder}
        onBeerStateChange={onBeerStateChange}
        beerId={result.id}
      />
    </div>
  );
};

export default SearchResult;
