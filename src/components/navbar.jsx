import React from "react";
import "../stylesheets/navbar.css";
import HistorySVG from "../utils/history.svg";
import { Link } from "react-router-dom";

const Navbar = ({ cartItems }) => {
  return (
    <div className="navbar">
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/history">
          <img src={HistorySVG} alt="Shopping cart" />
        </Link>
        <Link to="/checkout">
          <div className="shopping-cart">
            <div className="shopping-cart-icon"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
