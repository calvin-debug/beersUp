import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import BeerPage from "./components/beerPage";
import Navbar from "./components/navbar";
import Checkout from "./components/checkout";
import OrderHistory from "./components/orderHistory";
import "./App.css";

function App() {
  const [beers, setBeers] = useState([]);

  const handleBeerGroupChange = (groups) => {
    setBeers(groups);
  };

  const getOpenOrder = () => {
    // Get the current open order from local storage
    const openOrder = localStorage.getItem("openOrder");
    if (!openOrder || openOrder.length === 0) return [];
    return JSON.parse(openOrder);
  };

  const getAllOrders = () => {
    // Get all orders from local storage
    const allOrders = localStorage.getItem("allOrders");
    if (!allOrders || allOrders.length === 0) return [];
    return JSON.parse(allOrders);
  };

  const generateOrderId = () => {
    const unixTime = Date.now().toString();
    const randomNumber = Math.floor(Math.random() * 1000).toString();
    return unixTime + randomNumber;
  };

  const resetAllBeerGroups = () => {
    // For every beer group in "beers", set its "groupInOrder" property to false.
    // Inside every group, set the "inOrder" property of every beer in "beers" to false
    const newBeers = beers.map((group) => {
      group.groupInOrder = false;
      group.beers = group.beers.map((beer) => {
        beer.inOrder = false;
        return beer;
      });
      return group;
    });

    setBeers(newBeers);
  };

  const handlePlaceOrderClick = () => {
    // Check the local storage for all orders
    const allOrders = localStorage.getItem("allOrders");

    // Creating the order object with an id and the order itself
    const finalisedOrder = {
      orderId: generateOrderId(),
      order: getOpenOrder(),
    };

    if (!allOrders) {
      // If there are no orders, create a new array with the current order
      localStorage.setItem("allOrders", JSON.stringify([finalisedOrder]));
    } else {
      // If there are orders, parse the orders and add the current order to the array
      const orders = JSON.parse(allOrders);
      orders.push(finalisedOrder);
      localStorage.setItem("allOrders", JSON.stringify(orders));
    }

    // Reset all beer groups to not be in order any more
    resetAllBeerGroups();

    // Setting the open order to an empty order
    localStorage.removeItem("openOrder");
  };

  return (
    <div>
      <Navbar cartItems={getOpenOrder().length} />
      <div className="page">
        <Routes>
          <Route
            exact
            path="/home"
            element={
              <BeerPage
                // shouldFetch={beers.length === 0}
                onBeerGroupChange={handleBeerGroupChange}
                beers={beers}
              />
            }
          />
          <Route
            exact
            path="/checkout"
            element={
              <Checkout
                getOpenOrder={getOpenOrder}
                onPlaceOrderClick={handlePlaceOrderClick}
              />
            }
          />
          <Route
            exact
            path="/history"
            element={<OrderHistory allOrders={getAllOrders()} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
