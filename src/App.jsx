import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import BeerPage from "./components/beerPage";
import Navbar from "./components/navbar";
import Checkout from "./components/checkout";
import OrderHistory from "./components/orderHistory";
import "./App.css";

function App() {
  const [beers, setBeers] = useState([]);

  const handleBeerListChange = (groups) => {
    setBeers(groups);
  };

  return (
    <div>
      <Navbar beers={beers} />
      <div className="page">
        <Routes>
          <Route
            exact
            path="/home"
            element={
              <BeerPage beers={beers} onBeerListChange={handleBeerListChange} />
            }
          />
          <Route
            exact
            path="/checkout"
            element={
              <Checkout beers={beers} onBeerListChange={handleBeerListChange} />
            }
          />
          <Route exact path="/history" element={<OrderHistory />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
