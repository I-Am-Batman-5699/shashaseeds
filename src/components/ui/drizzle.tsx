"use client";
import classes from "@/styles/drizzle.module.css";
import React, { useEffect, useState } from "react";

// Drop and cloud size constants
const drizzleCount = 50;
const wM = 0.625, wS = 0.3125;
const bLR = 0.3125, bB = 0.9375, bt = 0.6875;

type DrizzleItem = {
    i: number;
    random50Chance: boolean;
    get6Random: number;
    get5Random: number;
    get2Random: number;
    getMainCloudRandom: boolean;
    getDropSize: "s" | "m";
    xC: number;
    yC: number;
    xCloudUp: number;
    yCloudUp: number;
    xC2: number;
    yC2: number;
    xCloudUp2: number;
    yCloudUp2: number;
};

function randomBool() {
    return Math.random() > 0.5;
}
function randomInRange(max: number) {
    return Math.random() * max;
}

function generateDrizzleData(count: number): DrizzleItem[] {
    const data: DrizzleItem[] = [];
    let xPositions = 0;
    for (let i = 0; i < count; i++) {
        const random50Chance = randomBool();
        const get6Random = randomInRange(6);
        const get5Random = randomInRange(5);
        const get2Random = randomInRange(2);
        const getMainCloudRandom = randomBool();
        const getDropSize = randomBool() ? "s" : "m";

        // For cloud positions
        const xC = xPositions;
        const yC = randomBool() ? randomInRange(5) : -randomInRange(1);
        const xCloudUp = xC + 3 + (yC < 0 ? 3 : 1);
        const yCloudUp = yC < 0 ? yC + 3 + randomInRange(2) : yC - 3 - randomInRange(2);

        // For secondary clouds
        const xC2 = xC + 50;
        const yC2 = randomBool() ? randomInRange(5) : -randomInRange(1);
        const xCloudUp2 = xC2 + 3 + (yC2 < 0 ? 3 : 1);
        const yCloudUp2 = yC2 < 0 ? yC2 + 3 + randomInRange(2) : yC - 3 -randomInRange(2);

        data.push({
            i,
            random50Chance,
            get6Random,
            get5Random,
            get2Random,
            getMainCloudRandom,
            getDropSize,
            xC, yC, xCloudUp, yCloudUp,
            xC2, yC2, xCloudUp2, yCloudUp2
        });

        xPositions += 4;
    }
    return data;
}

function Drizzle() {
    const [drizzleData, setDrizzleData] = useState<any[]>([]);

    useEffect(() => {
        setDrizzleData(generateDrizzleData(drizzleCount));
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {drizzleData.map((item, i) => (
                <div key={item.i + "clouds"}>
                    {/* Render main clouds every even item */}
                    {i % 2 === 0 && (
                        <div>
                            <div>
                                <div
                                    className={classes["cloud"]}
                                    style={{
                                        "--xC": `${item.xC}vw`,
                                        "--yC": `${item.yC}rem`,
                                        "--box-shadow-color4": "#FFFFFF",
                                        "--box-shadow-color5": `${item.random50Chance ? "#f0ededf6" : "#FFFFFF"}`
                                    } as React.CSSProperties}
                                ></div>
                                <div
                                    className={classes["cloudUp"]}
                                    style={{
                                        "--xC": `${item.xCloudUp}vw`,
                                        "--yC": `${item.yCloudUp}rem`,
                                        "--box-shadow-color4": "#FFFFFF",
                                        "--box-shadow-color5": item.random50Chance ? "#f0ededf6" : "#FFFFFF"
                                    } as React.CSSProperties}
                                ></div>
                            </div>
                            <div>
                                <div
                                    className={classes["cloud"]}
                                    style={{
                                        "--xC": `${item.xC2}vw`,
                                        "--yC": `${(item.yC2)}rem`,
                                        "--box-shadow-color5": item.random50Chance ? "#f0ededf6" : "#FFFFFF",
                                        "--box-shadow-color4": "#FFFFFF"
                                    } as React.CSSProperties}
                                ></div>
                                <div
                                    className={classes["cloudUp"]}
                                    style={{
                                        "--xC": `${item.xCloudUp2}vw`,
                                        "--yC": `${item.yCloudUp2}rem`,
                                        "--box-shadow-color4": "#FFFFFF",
                                        "--box-shadow-color5": item.random50Chance ? "#f0ededf6" : "#FFFFFF"
                                    } as React.CSSProperties}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Render two drops for each item */}
                    <div
                        className={classes["drop"]}
                        style={{
                            "--size": `${item.getDropSize === 's' ? wS : wM}rem`,
                            "--top": `${item.getDropSize === 's' ? -wS : -wM}rem`,
                            "--bLR": `${item.getDropSize === 's' ? bLR / 2 : bLR}rem`,
                            "--bB": `${item.getDropSize === 's' ? bB / 2 : bB}rem`,
                            "--bt": `${item.getDropSize === 's' ? -bt / 2 : -bt}rem`,
                            "--duration": `${Math.random() * 2 + 3.5}s`,
                            "--delay": `${Math.random() * 5}s`,
                            "--x": `${Math.random() * 50}vw`,
                        } as React.CSSProperties}
                    />
                    <div
                        className={classes["drop"]}
                        style={{
                            "--size": `${item.getDropSize === 's' ? wS : wM}rem`,
                            "--top": `${item.getDropSize === 's' ? -wS : -wM}rem`,
                            "--bLR": `${item.getDropSize === 's' ? bLR / 2 : bLR}rem`,
                            "--bB": `${item.getDropSize === 's' ? bB / 2 : bB}rem`,
                            "--bt": `${item.getDropSize === 's' ? -bt / 2 : -bt}rem`,
                            "--duration": `${Math.random() * 2 + 3.5}s`,
                            "--delay": `${Math.random() * 5}s`,
                            "--x": `${Math.random() * 50 + 50}vw`,
                        } as React.CSSProperties}
                    />
                </div>
            ))}
        </div>
    );
}

export default Drizzle;