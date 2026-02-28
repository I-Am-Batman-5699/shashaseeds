"use client";

import { useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Link from "next/link";
import ThemeToggle from "@/components/ui/themeToggle";
import { Button } from "@/components/ui/button";
import SVGIcon from "@/components/ui/svgIcon";
import { ActionButton } from "@/types/navigation";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface MobileProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  actionButtons: ActionButton[];
}

export default function MobileProfileModal({
  isOpen,
  onClose,
  user,
  isLoggedIn,
  onLogin,
  onLogout,
  actionButtons
}: MobileProfileModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Below navbar */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-green-50/40 to-green-100/40 dark:from-slate-900/40 dark:to-slate-950/40 backdrop-blur-sm z-[95] animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[96] flex items-center justify-center p-4">
        <div
          className="
            w-full max-w-sm max-h-[90vh] overflow-y-auto
            bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950
            border border-theme rounded-3xl shadow-2xl
            animate-in zoom-in-95 duration-200
          "
        >
          <div className="p-6 space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-secondary-bg rounded-xl transition-colors text-secondary-text hover:text-primary-text z-10"
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
            <div className="flex items-start gap-4 pt-2">
              <div className="relative">
                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-30 animate-pulse" />
                <Avatar 
                  alt={user.name} 
                  src={user.avatar} 
                  sx={{ width: 64, height: 64 }}
                  className="relative border-2 border-accent shadow-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-primary-text">
                  {isLoggedIn ? user.name : "Unknown User"}
                </p>
                {isLoggedIn && (
                  <p className="text-sm text-secondary-text mt-1">
                    {user.email}
                  </p>
                )}
                {!isLoggedIn && (
                  <p className="text-xs text-secondary-text mt-1 font-mono">
                    <span className="text-cyber">[</span> Guest Mode <span className="text-cyber">]</span>
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px border-t border-reverse-theme" />

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isLoggedIn && (
                <Button
                  onClick={() => {
                    onLogin();
                    onClose();
                  }}
                  className="w-full bg-inverse dark:bg-inverse hover:bg-accent text-inverse dark:text-inverse rounded-xl h-12 font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
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
                .filter(btn => btn.visible && btn?.featureEnabled && btn.id === "shop-now")
                .map((button) => (
                  <Button
                    key={button.id}
                    className="w-full h-12 bg-primary-bg border border-theme text-primary-text hover:bg-secondary-bg rounded-xl font-semibold transition-all hover:scale-[1.02]"
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

            {/* Theme Toggle */}
            <div className="p-4 bg-primary-bg border border-theme rounded-2xl shadow-inner">
              <ThemeToggle />
            </div>

            {/* Sign Out Button */}
            {isLoggedIn && (
              <>
                <div className="h-px border-t border-theme" />
                <Button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  variant="ghost"
                  className="w-full justify-start text-secondary-text hover:text-accent hover:bg-secondary-bg h-12 rounded-xl font-medium transition-colors"
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
            <div className="text-center pt-2">
              <p className="text-xs text-secondary-text font-mono">
                <span className="text-cyber">[</span> STATUS: <span className="text-accent">OPTIMAL</span> <span className="text-cyber">]</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}