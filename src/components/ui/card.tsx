import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg inset-shadow-sm inset-shadow-indigo-200/50 bg-gradient-to-br from-green-50 to-green-100 text-zinc-950 shadow-md flex flex-col rounded-t-2xl",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-1 min-h-20 max-h-24", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-medium leading-none tracking-tight min-h-8 max-h-14 mt-0 mb-0 py-0 pl-1",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle";

const CardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xs leading-none tracking-tight min-h-6 max-h-12 my-0 py-0 text-slate-400 pl-1",
      className
    )}
    {...props}
  />
))
CardSubtitle.displayName = "CardSubtitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400 pt-2", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-6 px-2 pt-0 min-h-40 max-h-80 flex flex-col flex-grow mx-2 rounded-sm overflow-hidden", className)} {...props} />
))
CardContent.displayName = "CardContent";

const CardUl = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul className={cn("", className)} {...props} />
))
CardUl.displayName = "CardUl";

const CardLi = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li className={cn("text-black", className)} {...props} />
))
CardLi.displayName = "CardLi";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex justify-end pt-1 pb-2 align-bottom items-end mb-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter";

const CardFooterContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex", className)}
    {...props}
  />
))
CardFooterContent.displayName = "CardFooterContent";

export { Card, CardContent, CardDescription, CardFooter, CardFooterContent, CardHeader, CardLi, CardSubtitle, CardTitle, CardUl };
