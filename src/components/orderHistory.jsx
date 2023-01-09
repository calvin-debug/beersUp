import React from "react";
import "../stylesheets/orderTable.css";
import { getAllOrdersFromLocalStorage } from "../utils/beerFunctions";
import EmptyTable from "./emptyTable";

const OrderHistory = () => {
  const allOrders = getAllOrdersFromLocalStorage();

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

  return (
    <div>
      <div className="co-table-header">
        <div className="co-table-text">
          <h1>Do you still remember these?</h1>
        </div>
      </div>
      <table className="table history-table">
        <thead>
          <tr>
            <th className="column-header-order-id">Order ID</th>
            <th className="column-header-group">Style</th>
            <th className="column-header-name">Name</th>
            <th className="column-header-brand">Brand</th>
            <th className="column-header-alcohol">%</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order) => {
            const orderId = order.orderId;
            const orderBeersGroups = order.order;
            return orderBeersGroups.map((group, groupIndex) => {
              const groupName = group.beers[0].style;
              return group.beers.map((beer, index) => {
                const isOrderIdCell = index === 0 && groupIndex === 0;
                return (
                  <tr
                    className={getRowClass(group.beers.length, index)}
                    key={beer.id}
                  >
                    <td
                      className={`column-row-order-id ${
                        isOrderIdCell ? "order-id" : ""
                      }`}
                    >
                      {isOrderIdCell ? orderId : ""}
                    </td>
                    <td>{index === 0 ? groupName : ""}</td>
                    <td>{beer.name}</td>
                    <td>{beer.brand}</td>
                    <td className="column-row-center">{beer.alcohol}</td>
                  </tr>
                );
              });
            });
          })}
        </tbody>
      </table>
      {allOrders.length === 0 && <EmptyTable />}
    </div>
  );
};

export default OrderHistory;
