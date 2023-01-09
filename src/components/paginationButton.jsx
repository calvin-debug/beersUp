import React from "react";

const PaginationButton = ({ number, isCurrent, onPageChange }) => {
  return (
    <button
      onClick={() => onPageChange(number)}
      className={`pagination-btn ${isCurrent ? "pagination-btn-active" : ""}`}
    >
      {number}
    </button>
  );
};

export default PaginationButton;
