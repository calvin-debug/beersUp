import React from "react";
import "../stylesheets/navbar.css";
import HistorySVG from "../utils/history.svg";
import beerBottleSVG from "../utils/beerBottle.svg";
import { Link } from "react-router-dom";
import { getOpenOrder } from "../utils/beerFunctions";

const Navbar = ({ beers }) => {
  const itemCount = getOpenOrder(beers).length;
  return (
    <div className="navbar">
      <div className="nav-links">
        <div>
          <Link className="nav-link" to="/home">
            <div className="nav-link-home">
              <img
                src={beerBottleSVG}
                height="30px"
                width="30px"
                alt="Beer bottle"
              />
              <p className="home-text">Beer's Up!</p>
              <img
                src={beerBottleSVG}
                height="30px"
                width="30px"
                alt="Beer bottle"
              />
            </div>
          </Link>
        </div>
        <div className="nav-link-shopping">
          <Link className="nav-link" to="/history">
            <img src={HistorySVG} alt="Shopping cart" />
          </Link>
          <Link className="nav-link" to="/checkout">
            <div className="shopping-cart">
              <div className="shopping-cart-icon">
                {itemCount > 0 && <p>{itemCount}</p>}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
