"use client";

interface IconProps {
  path: string;
  className?: string;
}

function SVGIcon({ path, className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default SVGIcon;