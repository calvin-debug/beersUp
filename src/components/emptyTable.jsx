import React from "react";
import { Link } from "react-router-dom";

const EmptyTable = (props) => {
  return (
    <div className="co-empty-cart">
      <h1>Nothing to see here...</h1>
      <Link to="/home">
        <button className="co-empty-cart-btn">Find some beers</button>
      </Link>
    </div>
  );
};

export default EmptyTable;
