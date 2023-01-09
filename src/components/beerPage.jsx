import React, { Component } from "react";
import {
  getAndSortBeers,
  findLowestAlcoholBeer,
  getOpenOrder,
  changeBeerState,
  changeGroupState,
  changeGroupOrder,
} from "../utils/beerFunctions";
import "../stylesheets/beerGroup.css";
import Loading from "./loading";
import BeerGroups from "./beerGroups";
import Searchbar from "./searchbar";
import Pagination from "./pagination";

class BeerPage extends Component {
  state = {
    page: 1,
    pageSize: 6,
  };

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

  handlePageChange = (page) => {
    this.setState({ page });
  };

  paginate = (elements, pageSize, currentPage) => {
    return elements.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  };

  handleRefreshClick = async () => {
    const groupedBeers = await getAndSortBeers(20);
    this.props.onBeerListChange(groupedBeers);
  };

  render() {
    const {
      handleGroupOrderChange,
      handleGroupStateChange,
      handleBeerStateChange,
      handlePageChange,
      paginate,
      handleRefreshClick,
    } = this;
    const { beers } = this.props;
    const beerListEmpty = this.props.beers.length === 0;
    const { page, pageSize } = this.state;
    const beersPaginated = paginate(beers, pageSize, page);

    return (
      <div>
        {beerListEmpty && <Loading />}
        {!beerListEmpty && (
          <div>
            <Searchbar
              beers={beers.flatMap((group) => group.beers)}
              onBeerStateChange={handleBeerStateChange}
              onRefreshClick={handleRefreshClick}
            />
            <BeerGroups
              onGroupOrderChange={handleGroupOrderChange}
              onGroupStateChange={handleGroupStateChange}
              onBeerStateChange={handleBeerStateChange}
              beerGroups={beersPaginated}
            />
            <Pagination
              currentPage={page}
              pageSize={pageSize}
              totalItems={beers.length}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    );
  }
}

export default BeerPage;
