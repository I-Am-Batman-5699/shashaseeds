"use client";
import React from "react";
import DoubleHelix from "@/components/loaders/DoubleHelix";

export default function NotFound() {
    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-[90vh] flex items-center justify-center">
            <div className="mx-auto max-w-[90vw] md:pb-8 pb-4 md:pt-4 pt-1">
                <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm dark:inset-shadow-indigo-900/50 space-y-1 min-w-[80vw] flex items-center justify-center min-h-[80vh]">
                    <DoubleHelix />
                </div>
            </div>
        </div>
    );
}