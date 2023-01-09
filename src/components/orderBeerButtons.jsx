import React from "react";

const OrderBeerButtons = ({
  canAdd,
  canSubtract,
  onGroupOrderChange,
  groupId,
}) => {
  return (
    <div className="order-buttons">
      <button
        className="btn-order btn-order-remove"
        disabled={!canSubtract}
        onClick={() => onGroupOrderChange(groupId, true)}
      >
        <div></div>
      </button>
      <button
        className="btn-order btn-order-add"
        disabled={!canAdd}
        onClick={() => onGroupOrderChange(groupId, false)}
      >
        <div></div>
      </button>
    </div>
  );
};

export default OrderBeerButtons;
