"use client";
import React from "react";



const FormulaFormatter = ({ text, className = "" }) => {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: (text) }}
    />
  );
};

export default FormulaFormatter;