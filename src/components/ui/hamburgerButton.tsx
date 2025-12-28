"use client";

import { Button } from "@/components/ui/button";

interface HamburgerButtonProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function HamburgerButton({ mobileMenuOpen, setMobileMenuOpen }: HamburgerButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-2 hover:bg-accent dark:hover:bg-accent lg:hidden"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <div className={`relative w-5 h-5 ${mobileMenuOpen ? "-translate-y-2" : ""}`}>
        <span
          className={`absolute block h-0.5 w-5 transform transition duration-300 ease-in-out ${
            mobileMenuOpen ? "rotate-45 translate-y-4 dark:bg-gray-200 bg-gray-900" : "translate-y-0 dark:bg-gray-100 bg-gray-800"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-5 transform transition duration-300 ease-in-out translate-y-2 ${
            mobileMenuOpen ? "opacity-0 dark:bg-gray-200 bg-gray-900" : "opacity-100 dark:bg-gray-100 bg-gray-800"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-5 transform transition duration-300 ease-in-out translate-y-4 ${
            mobileMenuOpen ? "-rotate-45 -translate-y-4 dark:bg-gray-200 bg-gray-900" : "translate-y-0 dark:bg-gray-100 bg-gray-800"
          }`}
        />
      </div>
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}

export default HamburgerButton;