import React, { Component } from "react";
import {
  getBeers,
  sortBeersByStyle,
  findLowestAlcoholBeer,
  getOpenOrder,
} from "../utils/beerFunctions";
import "../stylesheets/beerPage.css";
import Loading from "./loading";
import BeerGroups from "./beerGroups";
import Searchbar from "./searchbar";

class BeerPage extends Component {
  state = {
    apiFetched: false,
  };

  async componentDidMount() {
    if (this.props.beers.length !== 0)
      return this.setState({ apiFetched: true });
    const beers = await getBeers(20);
    const groupedBeers = sortBeersByStyle(beers);
    this.setState({ apiFetched: true });
    this.props.onBeerGroupChange(groupedBeers);
  }

  componentDidUpdate(prevProps) {
    // Save the open order to local storage if the beer groups have changed.
    // Only do so if the previous beer groups were not empty.
    if (this.props.beers !== prevProps.beers && prevProps.beers.length > 0) {
      this.updateOpenOrderLocal();
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
    const beerGroups = [...this.props.beers];
    const beerGroup = beerGroups.find((group) => group.groupId === groupId);
    if (!remove) beerGroup.groupInOrder = true;
    else beerGroup.groupInOrder = false;
    this.props.onBeerGroupChange(beerGroups);
  };

  handleGroupOrderChange = (groupId, remove) => {
    const beerGroups = [...this.props.beers];
    const beerGroup = beerGroups.find((group) => group.groupId === groupId);
    if (!remove) this.addLowestAlcoholBeerToOrder(beerGroup);
    else this.removeLowestAlcoholBeerFromOrder(beerGroup);

    // Check if the group has any beers that are "inOrder"
    // If not, then set the group to not be in the order, as an empty group
    // should not be in the order.
    const groupHasBeersInOrder = beerGroup.beers.some((beer) => beer.inOrder);
    if (!groupHasBeersInOrder) beerGroup.groupInOrder = false;

    this.props.onBeerGroupChange(beerGroups);
  };

  handleBeerStateChange = (beerId, remove) => {
    const beerGroups = [...this.props.beers];
    const allBeers = beerGroups.flatMap((group) => group.beers);
    const beer = allBeers.find((beer) => beer.id === beerId);
    beer.inOrder = remove;

    // Check if the group has any beers that are "inOrder"
    // If not, then set the group to not be in the order, as an empty group
    // should not be in the order.
    const groupId = beer.groupId;
    const beerGroup = beerGroups.find((group) => group.groupId === groupId);
    const groupHasBeersInOrder = beerGroup.beers.some((beer) => beer.inOrder);
    if (!groupHasBeersInOrder) beerGroup.groupInOrder = false;

    this.props.onBeerGroupChange(beerGroups);
  };

  render() {
    const {
      handleGroupOrderChange,
      handleBeerStateChange,
      handleGroupStateChange,
    } = this;
    const { beers } = this.props;
    return (
      <div>
        {!this.state.apiFetched && <Loading />}
        {this.state.apiFetched && (
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
