import React from "react";
import SearchResult from "./searchResult";
import Beer from "./beer";

const SearchResults = ({ searchResults, onBeerStateChange }) => {
  return (
    <div className="search-results">
      {searchResults.map((result, index) => {
        return <Beer key={index} {...result} />;
      })}
    </div>
  );
};

export default SearchResults;
