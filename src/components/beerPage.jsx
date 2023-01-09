import React, { Component } from "react";
import {
  getAndSortBeers,
  findLowestAlcoholBeer,
  getOpenOrder,
  changeBeerState,
  changeGroupState,
  changeGroupOrder,
} from "../utils/beerFunctions";
import "../stylesheets/beerPage.css";
import Loading from "./loading";
import BeerGroups from "./beerGroups";
import Searchbar from "./searchbar";

class BeerPage extends Component {
  async componentDidMount() {
    if (this.props.beers.length !== 0) return;
    const groupedBeers = await getAndSortBeers(20);
    this.props.onBeerListChange(groupedBeers);
  }

  componentDidUpdate(prevProps) {
    // Save the open order to local storage if the beer groups have changed.
    // Only do so if the previous beer groups were not empty.
    if (this.props.beers !== prevProps.beers && prevProps.beers.length > 0) {
      this.updateOpenOrderLocal();
      console.log("Updated open order in local storage.");
    }
  }

  updateOpenOrderLocal = () => {
    localStorage.setItem(
      "openOrder",
      JSON.stringify(getOpenOrder(this.props.beers))
    );
  };

  addLowestAlcoholBeerToOrder = (group) => {
    findLowestAlcoholBeer(group.beers, false).inOrder = true;
  };

  removeLowestAlcoholBeerFromOrder = (group) => {
    findLowestAlcoholBeer(group.beers, true).inOrder = false;
  };

  handleGroupStateChange = (groupId, remove) => {
    const beerGroups = changeGroupState(this.props.beers, groupId, remove);
    this.props.onBeerListChange(beerGroups);
  };

  handleGroupOrderChange = (groupId, remove) => {
    const beerGroups = changeGroupOrder(this.props.beers, groupId, remove);
    this.props.onBeerListChange(beerGroups);
  };

  handleBeerStateChange = (beerId, remove) => {
    const beerGroups = changeBeerState(this.props.beers, beerId, remove);
    this.props.onBeerListChange(beerGroups);
  };

  render() {
    const {
      handleGroupOrderChange,
      handleGroupStateChange,
      handleBeerStateChange,
    } = this;
    const { beers } = this.props;
    const beerListEmpty = this.props.beers.length === 0;
    return (
      <div>
        {beerListEmpty && <Loading />}
        {!beerListEmpty && (
          <div>
            <Searchbar
              beers={beers.flatMap((group) => group.beers)}
              onBeerStateChange={handleBeerStateChange}
            />
            <BeerGroups
              onGroupOrderChange={handleGroupOrderChange}
              onGroupStateChange={handleGroupStateChange}
              onBeerStateChange={handleBeerStateChange}
              beerGroups={beers}
            />
          </div>
        )}
      </div>
    );
  }
}

export default BeerPage;
