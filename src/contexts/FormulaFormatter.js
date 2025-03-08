"use client";
import React from "react";

const subscriptMap = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
  "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ",
  "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ",
  "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ",
  "v": "ᵥ", "x": "ₓ"
};

const superscriptMap = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
  "n": "ⁿ", "⊕": "⊕", "⊖": "⊖",
};

const greekMap = {
  "alpha": "α", "beta": "β", "gamma": "γ", "delta": "δ", "epsilon": "ε",
  "zeta": "ζ", "eta": "η", "theta": "θ", "iota": "ι", "kappa": "κ",
  "lambda": "λ", "mu": "μ", "nu": "ν", "xi": "ξ", "omicron": "ο",
  "pi": "π", "rho": "ρ", "sigma": "σ", "tau": "τ", "upsilon": "υ",
  "phi": "φ", "chi": "χ", "psi": "ψ", "omega": "ω"
};

const formatChemicalFormula = (text) => {
  if (!text) return "";

  // Replace Greek letters
  text = text.replace(/\b(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)\b/gi,
    (match) => greekMap[match.toLowerCase()] || match
  );

  // Handle subscripts
  text = text.replace(/_\{([^}]+)}/g, (_, match) =>
    match.split("").map(char => subscriptMap[char] || char).join("")
  );
  text = text.replace(/_([a-z0-9]+)/gi, (_, match) =>
    match.split("").map(char => subscriptMap[char] || char).join("")
  );

  // Handle superscripts
  text = text.replace(/\^\{([^}]+)}/g, (_, match) =>
    match.split("").map(char => superscriptMap[char] || char).join("")
  );
  text = text.replace(/\^([0-9+\-()=n⊕⊖]+)/gi, (_, match) =>
    match.split("").map(char => superscriptMap[char] || char).join("")
  );

  // Improve spacing around arrows and other symbols
  text = text
    .replace(/([A-Za-z0-9])([→+])/g, "$1 $2 ")
    .replace(/([→+])([A-Za-z0-9])/g, " $1 $2")
    .replace(/→┴/g, " →┴ ");

  return text;
};

const FormulaFormatter = ({ text, className = "" }) => {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: formatChemicalFormula(text) }}
    />
  );
};

export default FormulaFormatter;