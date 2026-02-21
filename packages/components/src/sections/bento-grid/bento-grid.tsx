// Source: Sera UI (seraui.com)
"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

const BentoCard = ({
  title,
  description,
  icon,
  className,
  children,
  href,
}: BentoCardProps) => {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/5 bg-gray-900/50 p-6 transition-all duration-300 hover:border-white/10 hover:bg-gray-900/80",
        href && "cursor-pointer",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </Wrapper>
  );
};

export { BentoGrid, BentoCard };
export type { BentoGridProps, BentoCardProps };
export default BentoGrid;
