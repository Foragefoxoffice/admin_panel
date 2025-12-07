'use client'

import { useState, useEffect } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

// Conversion rules (JS version)
const conversionRules = [
  [/\b(\w)_(\d)\b/g, '$1_$2'], // v_1, m_1 etc. (convert subscripts)
  [/\b([a-zA-Z0-9]+)\s+([a-zA-Z0-9]+)\b/g, '$1 \\cdot $2'], // Implicit multiplication
  [/〖/g, '('], // Replace Word brackets
  [/〗/g, ')'],
  [/\b(\d+)\s*\+(\d+)\b/g, '$1 + $2'], // Ensure spaces around operations
  [/\b([A-Za-z0-9]+)\s*\-\s*([A-Za-z0-9]+)\b/g, '$1 - $2'], // Subtraction
  [/\b(\d+)\s*\/\s*(\d+)\b/g, '\\frac{$1}{$2}'], // Handle fractions
  [/→┴\("([^"]+)"\)/g, (_, label) => `\\xrightarrow{\\text{${label.trim()}}}`], // Handle →┴("light")
  [/┬"([^"]+)"/g, (_, label) => `(\\text{${label.trim()}})`], // "label" to text in parentheses
  [/;/g, '\\, ; \\quad'], // Fix semicolons
  [/=/g, ' = '], // Handle equal signs
  [/\s+/g, ' '], // Normalize spaces
  [/^\s+|\s+$/g, ''], // Trim spaces
]

const convertFormula = (input) => {
  let output = input
  for (const [pattern, replacement] of conversionRules) {
    output = output.replace(pattern, replacement)
  }
  return output.trim()
}

export default function FormulaConverter() {
  const [bulkInput, setBulkInput] = useState('')
  const [convertedList, setConvertedList] = useState([])

  useEffect(() => {
    const lines = bulkInput.split('\n')
    const converted = lines.map(convertFormula)
    setConvertedList(converted)
  }, [bulkInput])

  const mathJaxConfig = {
    loader: { load: ['[tex]/ams'] },
    tex: { packages: ['base', 'ams'] },
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bulk Formula Converter</h1>

      <textarea
        className="w-full h-48 p-4 mb-4 border rounded font-mono"
        placeholder="Paste multiple formulas here (one per line)..."
        value={bulkInput}
        onChange={(e) => setBulkInput(e.target.value)}
      />

      <h2 className="text-xl font-semibold mb-2">Converted & Previewed:</h2>

      <MathJaxContext version={3} config={mathJaxConfig}>
        <div className="space-y-6">
          {convertedList.map((converted, idx) => (
            <div key={idx} className="p-4 border rounded bg-white shadow-sm">
              <div className="mb-2 text-sm text-gray-500">Line {idx + 1}</div>
              <div className="mb-2 font-mono bg-gray-100 p-2 rounded">{converted}</div>
              <MathJax inline={false} dynamic>
                {`$$${converted}$$`}
              </MathJax>
            </div>
          ))}
        </div>
      </MathJaxContext>
    </main>
  )
}
