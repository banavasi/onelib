// Source: Sera UI (seraui.com)
"use client"
import React, { useState } from 'react';

// Type definitions
interface FAQItem {
  question: string;
  answer: string;
}

interface FancyAccordionProps {
  items: FAQItem[];
  defaultOpen?: number | null;
}

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

// AccordionItem component for each FAQ entry
const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-white/90 dark:bg-black/90 rounded-xl shadow-lg border border-gray-200 dark:border-green-500/60 mb-4 overflow-hidden backdrop-blur-md relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-green-400/15 dark:to-green-500/10 rounded-xl pointer-events-none"></div>
      
      <button
        className="w-full flex justify-between items-center text-left p-6 focus:outline-none hover:bg-gray-50 dark:hover:bg-green-800/30 transition-colors duration-200 relative z-10"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-green-50">{question}</span>
        {/* Chevron Icon with a smoother, longer transition */}
        <svg
          className={`w-6 h-6 text-gray-600 dark:text-green-300 transform transition-transform duration-500 ease-in-out ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {/* Collapsible content area with a smoother, longer transition */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        {/* Answer text with a fade-in effect for a smoother appearance */}
        <div className="p-6 pt-0 relative z-10">
          <p className={`text-gray-700 dark:text-green-100 leading-relaxed transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 delay-200' : 'opacity-0'}`}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main FancyAccordion component that accepts items prop
export default function FancyAccordion({ items, defaultOpen = 0 }: FancyAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  const handleItemClick = (index: number) => {
    // If the clicked item is already open, close it. Otherwise, open it.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {items.map((faq, index) => (
        <AccordionItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
}
