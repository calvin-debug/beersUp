import React from "react";
import Beer from "./beer";
import OrderBeerButtons from "./orderBeerButtons";
import OrderButton from "./orderButton.jsx";

const BeerGroup = ({
  group,
  onGroupStateChange,
  onBeerStateChange,
  ...rest
}) => {
  return (
    <div className={`beer-group ${group.groupInOrder && "beer-group-added"}`}>
      <div className="beer-group-header">
        <h3 className="group-title">{group.style}</h3>
        <OrderBeerButtons
          canAdd={group.beers.some((beer) => beer.inOrder === false)}
          canSubtract={group.beers.some((beer) => beer.inOrder === true)}
          {...rest}
        />
      </div>
      <div className="beer-list">
        {group.beers.map((beer, index) => (
          <Beer key={index} onBeerStateChange={onBeerStateChange} {...beer} />
        ))}
      </div>
      <OrderButton
        canAddToOrder={group.beers.some((beer) => beer.inOrder === true)}
        isAdded={group.groupInOrder}
        onGroupStateChange={onGroupStateChange}
        groupId={group.groupId}
      />
    </div>
  );
};

export default BeerGroup;
