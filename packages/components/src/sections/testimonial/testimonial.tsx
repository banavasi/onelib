// Source: Sera UI (seraui.com)
"use client";
import React, { useState } from "react";

const StarIcon = ({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
  </svg>
);

interface TestimonialData {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: TestimonialData[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechFlow",
    content:
      "This component library has completely transformed our development workflow. The quality and attention to detail is remarkable. We shipped our product 3x faster.",
    rating: 5,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Lead Developer",
    company: "BuildCo",
    content:
      "I've tried many UI libraries, but this one stands out. The components are well-crafted, accessible, and easy to customize. Highly recommended for any serious project.",
    rating: 5,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Michael",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Design Engineer",
    company: "PixelPerfect",
    content:
      "The design system is incredibly cohesive. Every component feels like it belongs together. It saved us hundreds of hours of design and development time.",
    rating: 5,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily",
  },
  {
    id: 4,
    name: "David Park",
    role: "Founder",
    company: "LaunchPad",
    content:
      "We built our entire SaaS platform using these components. The result looks professional and polished. Our users constantly compliment the UI.",
    rating: 4,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Product Manager",
    company: "InnovateLab",
    content:
      "From prototyping to production, this library has been invaluable. The documentation is excellent and the community support is fantastic.",
    rating: 5,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Frontend Architect",
    company: "ScaleUp",
    content:
      "The TypeScript support is first-class. Auto-completion works perfectly and the type safety has prevented countless bugs in our codebase.",
    rating: 5,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=James",
  },
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by developers
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See what developers and teams are saying about their experience
            building with our components.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-12 border border-white/5">
            <QuoteIcon className="absolute top-8 left-8 w-12 h-12 text-indigo-500/20" />
            <div className="relative z-10">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    filled={i < testimonials[activeIndex].rating}
                  />
                ))}
              </div>
              <blockquote className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-8">
                &ldquo;{testimonials[activeIndex].content}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  className="w-12 h-12 rounded-full bg-gray-700"
                />
                <div>
                  <div className="font-semibold text-white">
                    {testimonials[activeIndex].name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonials[activeIndex].role} at{" "}
                    {testimonials[activeIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`text-left p-6 rounded-xl border transition-all duration-300 ${
                index === activeIndex
                  ? "bg-indigo-500/10 border-indigo-500/30"
                  : "bg-gray-900/50 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    filled={i < testimonial.rating}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-8 h-8 rounded-full bg-gray-700"
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonial };
export default Testimonial;
