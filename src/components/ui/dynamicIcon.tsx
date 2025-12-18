"use client";
import React from 'react';

const ICON_DATA = {
  helix: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20M22 12A14.5 14.5 0 0 1 2 12" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  recycle: (
    <path d="M7 21v-4M7 21h4M7 21l3.5-3.5M17 3v4M17 3h-4M17 3l-3.5 3.5M21 7l-3.5 3.5M3 17l3.5-3.5M10.5 10.5l-3.5 3.5M13.5 13.5l3.5-3.5" />
  ),
  quote: (
    <>
      <path d="M3 21c3 0 5-2 5-5V7h-3v4H5v5c0 3 2 5 5 5h-7z" />
      <path d="M15 21c3 0 5-2 5-5V7h-3v4h-2v5c0 3 2 5 5 5h-7z" />
    </>
  ),
  book: (
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20" />
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

export type IconName = keyof typeof ICON_DATA;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

const DynamicIcon = ({ name, ...props }: IconProps) => {
  const iconContent = ICON_DATA[name];

  if (!iconContent) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="24"
      height="24"
      {...props}
    >
      {iconContent}
    </svg>
  );
};

export default DynamicIcon;