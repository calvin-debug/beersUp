import React from "react";
import Beer from "./beer";

const SearchResults = ({ searchResults, onBeerStateChange }) => {
  return (
    <div className="search-results">
      {searchResults.map((result, index) => {
        return (
          <Beer key={index} {...result} onBeerStateChange={onBeerStateChange} />
        );
      })}
    </div>
  );
};

export default SearchResults;
