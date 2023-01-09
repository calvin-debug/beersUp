import React from "react";

const OrderButton = ({
  isAdded,
  canAddToOrder,
  onGroupStateChange,
  groupId,
}) => {
  return (
    <button
      onClick={() => onGroupStateChange(groupId, isAdded)}
      className="btn-group"
      disabled={!canAddToOrder}
    >
      {isAdded ? "Remove group from order" : "Add group to order"}
    </button>
  );
};

export default OrderButton;
