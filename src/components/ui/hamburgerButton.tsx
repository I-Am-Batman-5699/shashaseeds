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
      className="p-2 hover:bg-green-600 dark:hover:bg-green-600 lg:hidden"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <div className={`relative w-5 h-5 ${mobileMenuOpen ? "-translate-y-2" : ""}`}>
        <span
          className={`absolute block h-0.5 w-5 transform transition duration-300 ease-in-out ${
            mobileMenuOpen ? "rotate-45 translate-y-4 bg-gray-200" : "translate-y-0 bg-gray-100"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-5 transform transition duration-300 ease-in-out translate-y-2 ${
            mobileMenuOpen ? "opacity-0 bg-gray-200" : "opacity-100 bg-gray-100"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-5 transform transition duration-300 ease-in-out translate-y-4 ${
            mobileMenuOpen ? "-rotate-45 -translate-y-4 bg-gray-200" : "translate-y-0 bg-gray-100"
          }`}
        />
      </div>
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}

export default HamburgerButton;