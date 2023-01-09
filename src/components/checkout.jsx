import React from "react";
import { Link } from "react-router-dom";
import "../stylesheets/orderTable.css";
import { getOpenOrder, changeBeerState } from "../utils/beerFunctions";
import EmptyTable from "./emptyTable";

const Checkout = ({ beers, onBeerListChange }) => {
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

    onBeerListChange(newBeers);
  };

  const handlePlaceOrderClick = () => {
    // Check the local storage for all orders
    const allOrders = localStorage.getItem("allOrders");

    // Creating the order object with an id and the order itself
    const finalisedOrder = {
      orderId: generateOrderId(),
      order: getOpenOrder(beers),
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

  const getRowClass = (groupSize, index) => {
    // Get the row class based on the group size and the index of the row
    if (groupSize === 1) {
      return "group-last group-first";
    }
    if (index === 0) {
      return "group-first";
    }
    if (index === groupSize - 1) {
      return "group-last";
    }
    return "";
  };

  const handleBeerStateChange = (beerId, remove) => {
    const beerGroups = changeBeerState(beers, beerId, remove);
    onBeerListChange(beerGroups);
  };

  // Generate the current open order based on the beers
  const beerOrderGroups = getOpenOrder(beers);

  return (
    <div>
      <div className="co-table-header">
        <div className="co-table-text">
          <h1>Shopping cart</h1>
        </div>
        <div className="co-place-order">
          <button
            onClick={handlePlaceOrderClick}
            className="co-place-order-btn"
            disabled={beerOrderGroups.length === 0}
          >
            Place order
          </button>
        </div>
      </div>
      <table className="table co-table">
        <thead>
          <tr>
            <th className="column-header-group">Group</th>
            <th className="column-header-name">Drink Name</th>
            <th className="column-header-brand">Brand</th>
            <th className="column-header-alcohol">%</th>
            <th className="column-header-delete">Delete</th>
          </tr>
        </thead>
        <tbody>
          {beerOrderGroups.map((group) => {
            const groupName = group.beers[0].style;
            return group.beers.map((beer, index) => (
              <tr
                key={beer.id}
                className={getRowClass(group.beers.length, index)}
              >
                <td>{index === 0 ? groupName : ""}</td>
                <td>{beer.name}</td>
                <td>{beer.brand}</td>
                <td className="column-row-center">{beer.alcohol}</td>
                <td className="column-row-center">
                  <div className="co-delete-btn-container">
                    <button
                      onClick={() => handleBeerStateChange(beer.id, false)}
                      className="co-delete-btn"
                    >
                      -
                    </button>
                  </div>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
      {beerOrderGroups.length === 0 && <EmptyTable />}
    </div>
  );
};

export default Checkout;
