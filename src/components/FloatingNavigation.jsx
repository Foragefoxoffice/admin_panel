"use client";
import { useState, useEffect } from "react";
import { 
  FaQuestion, 
  FaList, 
  FaCheck, 
  FaLightbulb, 
  FaArrowUp,
  FaA,
  FaB,
  FaC,
  FaD
} from "react-icons/fa6";

const FloatingNavigation = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const mainSections = [
    { id: "question", label: "Question", icon: <FaQuestion size={14} /> },
    { id: "options", label: "Options", icon: <FaList size={14} /> },
    { id: "correct-answer", label: "Correct", icon: <FaCheck size={14} /> },
    { id: "hint", label: "Hint", icon: <FaLightbulb size={14} /> },
  ];

  const optionSections = [
    { id: "optionA", label: "Option A", icon: <span className="font-bold">A</span> },
    { id: "optionB", label: "Option B", icon: <span className="font-bold">B</span> },
    { id: "optionC", label: "Option C", icon: <span className="font-bold">C</span> },
    { id: "optionD", label: "Option D", icon: <span className="font-bold">D</span> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
      
      const scrollPosition = window.scrollY + 100;
      
      // Check all sections
      const allSections = [...mainSections, ...optionSections];
      for (const section of allSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-2">
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-purple-700 text-white rounded-full shadow-lg hover:bg-purple-800 transition-colors flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={14} />
        </button>
      )}
      
      {/* Main Navigation */}
      <div className="flex flex-col gap-2">
        {mainSections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`p-3 rounded-full shadow-lg transition-all flex items-center justify-center ${
              activeSection === section.id
                ? "bg-purple-700 text-white"
                : "bg-white text-purple-700 hover:bg-purple-100"
            }`}
            aria-label={`Jump to ${section.label}`}
          >
            {section.icon}
          </button>
        ))}
        
        {/* Options expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`p-3 rounded-full shadow-lg transition-all flex items-center justify-center ${
            activeSection && activeSection.startsWith('option')
              ? "bg-purple-700 text-white"
              : "bg-white text-purple-700 hover:bg-purple-100"
          }`}
          aria-label={expanded ? "Collapse options" : "Expand options"}
        >
          <FaList size={14} />
        </button>
      </div>
      
      {/* Expanded Options Navigation */}
      {expanded && (
        <div className="flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg">
          {optionSections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                scrollToSection(section.id);
                setExpanded(false);
              }}
              className={`p-3 rounded-full shadow transition-all flex items-center justify-center ${
                activeSection === section.id
                  ? "bg-purple-700 text-white"
                  : "bg-gray-100 text-purple-700 hover:bg-purple-100"
              }`}
              aria-label={`Jump to ${section.label}`}
            >
              {section.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingNavigation;