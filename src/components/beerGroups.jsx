import React from "react";
import BeerGroup from "./beerGroup";
import "../stylesheets/beerGroup.css";

const BeerGroups = ({ beerGroups, ...rest }) => {
  return (
    <div className="beer-groups">
      {beerGroups.map((group, index) => (
        <BeerGroup
          key={index}
          groupId={group.groupId}
          group={group}
          {...rest}
        />
      ))}
    </div>
  );
};

export default BeerGroups;
