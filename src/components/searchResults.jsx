import React from "react";

const SearchResults = ({ searchResults, onBeerStateChange }) => {
  return (
    <div className="search-results">
      {searchResults.map((result, index) => {
        return (
          <div key={index} className="search-result">
            <p>
              {result.brand} - {result.name}
            </p>
            {!result.inOrder ? (
              <button
                onClick={() => onBeerStateChange(result.id, true)}
                className="btn-search btn-search-add"
              >
                Add
              </button>
            ) : (
              <button
                onClick={() => onBeerStateChange(result.id, false)}
                className="btn-search btn-search-remove"
              >
                Remove
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
