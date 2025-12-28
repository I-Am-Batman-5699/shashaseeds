import React from "react";
import classes from "@/styles/double-helix.module.css";

// multiple of 8 for smoothness
const points = 56;

const DoubleHelix: React.FC = () => (
    <div className="md:p-4 p-2 space-y-1 min-w-[80vw] flex items-center justify-center min-h-[80vh]">
        <div className="rounded-full p-4 glowingContainer">
            <div className={classes.items}>
                {
                    Array.from({ length: points }).map((_, index) => {
                        const strandNumber = index + 1;
                        return (
                            <div
                                key={index + "strand"}
                                className={classes.item}
                                style={{
                                    '--strand': strandNumber
                                } as React.CSSProperties}
                            >
                                <div className={classes.dot} />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    </div>
);

export default DoubleHelix;