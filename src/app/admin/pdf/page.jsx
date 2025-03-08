"use client";

import { useState } from "react";
import mammoth from "mammoth";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const DocxUpload = () => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);

  const extractTextFromDocx = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve) => {
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;

        // Extract plain text (without HTML)
        const { value } = await mammoth.extractRawText({ arrayBuffer });

        // Convert subscripts, superscripts, and math formulas to MathJax
        let formattedText = value
          .replace(/([A-Za-z])(\d+)/g, "$1_{ $2 }")  // Subscript: H2O → H_{2}O
          .replace(/(\^)(\d+)/g, "^{ $2 }")  // Superscript: mc^2 → mc^{2}
          .replace(/\b(sin|cos|tan|log|ln|exp|sqrt)\(?([a-zA-Z0-9]*)\)?/g, "\\$1 $2")  // Trig & log functions
          .replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}") // Fractions: 1/2 → \frac{1}{2}
          .replace(/alpha|beta|gamma|delta|theta|lambda|pi|sigma|omega/g, (match) => `\\${match}`); // Greek letters

        // Split into separate questions (assuming each question is on a new line)
        const questionList = formattedText.split("\n").filter((q) => q.trim() !== "");

        resolve(questionList);
      };
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a DOCX file.");
      return;
    }

    const extractedQuestions = await extractTextFromDocx(file);
    setQuestions(extractedQuestions);
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-4">Upload DOCX and Extract Questions</h2>

      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2"
      />

      <button onClick={handleUpload} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Extract Questions
      </button>

      {questions.length > 0 && (
        <div className="mt-5 p-4 border rounded">
          <h3 className="text-md font-semibold">Extracted Questions:</h3>
          <MathJaxContext>
            {questions.map((q, index) => (
              <p key={index} className="mt-2">
                <MathJax>{"$" + q + "$"}</MathJax>
              </p>
            ))}
          </MathJaxContext>
        </div>
      )}
    </div>
  );
};

export default DocxUpload;
