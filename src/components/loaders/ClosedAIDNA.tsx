"use client";
import React from "react";
import "./AIDNA.css";

const noOfDots = 36;

const AIDNALoader: React.FC = () => {
    return (<div className="double-helix-container">
        <div className="helix">
            {
                Array.from({ length: noOfDots }).map((_, index) => (
                    <div key={index}
                        className="dot"
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