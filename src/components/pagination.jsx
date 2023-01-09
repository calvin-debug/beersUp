import React from "react";
import "../stylesheets/pagination.css";
import PaginationButton from "./paginationButton";

const Pagination = ({ currentPage, pageSize, totalItems, onPageChange }) => {
  const pageCount = Math.ceil(totalItems / pageSize);
  const pages = [...Array(pageCount).keys()].map((i) => i + 1);
  return (
    <div className="pagination">
      <div className="pagination-btns">
        {pages.map((page) => (
          <PaginationButton
            isCurrent={currentPage === page}
            key={page}
            number={page}
            onPageChange={onPageChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Pagination;
