"use client";

import { useEffect, useRef } from "react";
import Avatar from '@mui/material/Avatar';
import Link from "next/link";
import ThemeToggle from "@/components/ui/themeToggle";
import { Button } from "@/components/ui/button";
import SVGIcon from "@/components/ui/svgIcon";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  actionButtons: any[];
}

export default function ProfileOverlay({
  isOpen,
  onClose,
  user,
  isLoggedIn,
  onLogin,
  onLogout,
  actionButtons
}: ProfileOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {

      const target = e.target as HTMLElement;
      if (target.closest('[aria-label="Toggle profile"]')) {
        return;
      }

      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop - Below navbar (z-[95]) */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-green-50/40 to-green-100/40 dark:from-slate-900/40 dark:to-slate-950/40  backdrop-blur-sm z-[95] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      <div
        ref={overlayRef}
        className={`
          fixed top-[4.5rem] left-0 h-[calc(100vh-4.5rem)] w-80 z-[96]
          bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950
          border border-theme shadow-2xl
          rounded-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full p-6 pt-2 overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="self-end p-2 hover:bg-secondary-bg rounded-xl transition-colors text-secondary-text hover:text-primary-text -mr-2"
            aria-label="Close profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Profile Section */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-30 animate-pulse" />
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ width: 56, height: 56 }}
                className="relative border-2 border-accent shadow-lg"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-primary-text">
                {isLoggedIn ? user.name : "Unknown User"}
              </p>
              {isLoggedIn && (
                <p className="text-sm text-secondary-text truncate mt-1">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px border-t border-theme mb-6" />

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            {!isLoggedIn && (
              <Button
                onClick={() => {
                  onLogin();
                  onClose();
                }}
                className="w-full bg-inverse dark:bg-inverse hover:bg-accent text-inverse dark:text-inverse rounded-xl h-11 font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] border border-theme"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Login
              </Button>
            )}

            {actionButtons
              .filter(btn => btn.visible && btn.featureEnabled && btn.id === "shop-now")
              .map((button) => (
                <Button
                  key={button.id}
                  className="w-full bg-primary-bg border border-theme text-primary-text hover:bg-secondary-bg rounded-xl h-11 font-semibold transition-all hover:scale-[1.02]"
                  asChild
                  onClick={onClose}
                >
                  <Link href={button.href || "#"}>
                    {button.icon && <SVGIcon path={button.icon} className="mr-2 h-5 w-5" />}
                    {button.label}
                  </Link>
                </Button>
              ))}
          </div>

          <div className="p-4 bg-primary-bg border border-theme rounded-2xl shadow-inner mb-6">
            <ThemeToggle />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sign Out Button */}
          {isLoggedIn && (
            <>
              <div className="h-px border-t border-theme mb-4" />
              <Button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                variant="ghost"
                className="w-full justify-start text-secondary-text hover:text-accent hover:bg-secondary-bg rounded-xl h-11 font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign Out
              </Button>
            </>
          )}

          {/* Status Indicator */}
          <div className="mt-4 text-center">
            <p className="text-xs text-secondary-text font-mono">
              <span className="text-cyber">[</span> STATUS: <span className="text-accent">CONNECTED</span> <span className="text-cyber">]</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}