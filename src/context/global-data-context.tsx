"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { FetchItems } from "@/lib/fetcher";
import companyData from "@/data/company.json";
import uiElements from "@/data/ui-elements.json";
import icons from "@/data/icons.json";
import navigation from "@/data/navigation.json";
import styles from "@/data/styles-css.json";
import { AppContextType, AppData } from "@/types/appContextText";

interface GlobalData {
    company: typeof companyData;
    ui: typeof uiElements;
    icons: typeof icons;
    navigation: typeof navigation;
    styles: typeof styles;
    appData: AppData | null;
    isGlobalDataLoading: boolean;
}

const GlobalDataContext = createContext<GlobalData | undefined>(undefined);

export const GlobalDataProvider = ({ children }: { children: ReactNode }) => {
    const [appData, setAppData] = useState<AppData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const response = await FetchItems({ path: '/models/appContentTexts.json' });
            if (response.status === "S" && response.data) {
                setAppData((response.data as AppContextType)?.appData);
            }
        } catch (error) {
            console.error("Transmission Error: Failed to fetch appContentTexts", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    const value = {
        company: companyData,
        ui: uiElements,
        icons: icons,
        navigation: navigation,
        styles: styles,
        appData: appData,
        isGlobalDataLoading: isLoading,
    };

    return (
        <GlobalDataContext.Provider value={value}>
            {children}
        </GlobalDataContext.Provider>
    );
};

export const useGlobalData = () => {
    const context = useContext(GlobalDataContext);
    if (!context) {
        throw new Error("useGlobalData must be used within a GlobalDataProvider");
    }
    return context;
};