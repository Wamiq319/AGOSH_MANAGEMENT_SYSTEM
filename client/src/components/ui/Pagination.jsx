import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Button from "./Button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        variant="outline"
        color="gold"
        rounded
        className="flex items-center"
      >
        <FaChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      <span className="text-sm text-gray-700 font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        variant="outline"
        color="gold"
        rounded
        className="flex items-center"
      >
        Next
        <FaChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default Pagination;
