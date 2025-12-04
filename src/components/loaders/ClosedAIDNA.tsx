"use client";
import React from "react";
import classes from "@/styles/AIDNA.module.css";

const noOfDots = 36;

const AIDNALoader: React.FC = () => {
    return (<div className={classes["double-helix-container"]}>
        <div className={classes["helix"]}>
            {
                Array.from({ length: noOfDots }).map((_, index) => (
                    <div key={index}
                        className={classes["dot"]}
                        style={{
                            ['--k' as string]: +(index / noOfDots).toFixed(5)
                        }}
                    />
                ))
            }
        </div>
    </div>);
}

export default AIDNALoader;