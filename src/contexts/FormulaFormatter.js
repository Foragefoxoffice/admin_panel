"use client";
import React from "react";



const FormulaFormatter = ({ text, className = "" }) => {
  return (
    <div
      className={`preview ${className}`}
      dangerouslySetInnerHTML={{ __html: (text) }}
    />
  );
};

export default FormulaFormatter;