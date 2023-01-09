import React, { useState, useRef, useEffect } from "react";
import "../stylesheets/searchbar.css";
import SearchSVG from "../utils/search.svg";
import SearchResults from "./searchResults";

const Searchbar = ({ beers, onBeerStateChange }) => {
  const containerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("brand");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!containerRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });

  const getSearchResults = () => {
    const searchResults = beers.filter((beer) => {
      return beer[searchCategory]
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
    setSearchResults(searchResults);
  };

  function handleQueryChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleCategoryChange(event) {
    setSearchCategory(event.target.value);
  }

  // Updating the search results when the search query or category changes
  useEffect(() => {
    getSearchResults();
  }, [searchQuery, searchCategory]);

  return (
    <div ref={containerRef} className="searchbar">
      <div className="search-icon">
        <img src={SearchSVG} alt="Shopping cart" />
      </div>
      <div className="search">
        <input
          className="searchbar-text"
          type="text"
          value={searchQuery}
          placeholder="Search..."
          onChange={handleQueryChange}
          onFocus={() => setShowResults(true)}
        />
        {showResults && searchQuery.length !== 0 && (
          <SearchResults
            searchResults={searchResults}
            onBeerStateChange={onBeerStateChange}
          />
        )}
      </div>
      <div className="searchbar-select">
        <select
          className="searchbar-select-menu"
          value={searchCategory}
          onChange={(e) => handleCategoryChange(e)}
        >
          <option value="brand">Brand</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
};

export default Searchbar;
