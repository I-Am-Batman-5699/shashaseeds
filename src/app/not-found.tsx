import React from "react";
import classes from "@/styles/notfound.module.css";
import Drizzle from "@/components/ui/drizzle";
import Link from "next/link";


export default function NotFound() {
  return (
    <div className={`${classes["notfound-root"]}`}>
      <div className={classes["drizzle-dark-overlay"]}>
        <Drizzle />
      </div>
      <div className={classes["notfound-content"]}>
        <p className="sm:text-2xl md:text-3xl lg:text-4xl">404</p>
        <p>Oops! Page not found.</p>
        <p>
          It looks like you’re lost in the drizzle.<br />
          <Link href="/" className={classes["notfound-link"]}>Go Home</Link>
        </p>
      </div>
    </div>
  );
}