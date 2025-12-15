import React from "react";
import classes from "@/app/notfound/notfound.module.css";
import Drizzle from "@/components/ui/drizzle";


export default function NotFound() {
  return (
    <div className={classes["notfound-root"]}>
      <Drizzle />
      <div className={classes["notfound-content"]}>
        <h1>404</h1>
        <p>Oops! Page not found.</p>
        <p>
          It looks like you’re lost in the drizzle.<br />
          <a href="/" className={classes["notfound-link"]}>Go Home</a>
        </p>
      </div>
    </div>
  );
}