import React from "react";
import classes from "@/styles/helix.module.css";

// multiple of 16 for smoothness
const points = 32;

const HelixHorizontal: React.FC = () => (
    <div className="bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-theme backdrop-blur-md shadow-lg">
        <div className={classes.loader}>
            {
                Array.from({ length: points }).map((_, index) => {
                    const strandNumber = index + 1;
                    const pairNumber = Math.ceil(strandNumber / 2);

                    return (
                        <div
                            key={index}
                            className={classes.strand}
                            style={{
                                '--n': strandNumber,
                                '--pair': pairNumber
                            } as React.CSSProperties}
                        >
                            <div className={classes.dot} />
                        </div>
                    );
                })
            }
        </div>
    </div>
);


export default HelixHorizontal;