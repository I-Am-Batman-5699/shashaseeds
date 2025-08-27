import React from "react";
import classes from "@/app/notfound/notfound.module.css";

const drizzleCount = 50;
let w = 3;

function Drizzle() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: drizzleCount }).map((_, i) => {
        const w = Math.random() * 4 + Math.random() * 4 + 6;
        return (
          <div
            key={i}
            className={classes["drop"]}
            style={{
              "--size": `${w}px`,
              "--duration": `${Math.random() * 2 + 3.5}s`,
              "--delay": `${Math.random() * 5}s`,
              "--x": `${Math.random() * 100}vw`,
              "--bwlr": `${w / 2}px`,
              "--bwb": `${w * 3 - 1}px`,
              "--db2": `${-(w * 2)}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

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