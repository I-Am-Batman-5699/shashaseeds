export interface DisplayData {
    loadingMessage: string
    searchPlaceholder: string
    defaultTitle: string
    sortButtonAriaLabel: string
    filterButtonAriaLabel: string
    filterPanelTitle: string
    closeFilterPanelAriaLabel: string
    fixedFilterLabel: string
    noItemsFoundTitle: string
    noItemsFoundMessage: string
    filterDisplayNames: FilterDisplayNames
    filterOptionDisplayNames: FilterOptionDisplayNames
}

export interface FilterDisplayNames {
    type: string
    organic: string
    available: string
    rating: string
}

export interface FilterOptionDisplayNames {
    flower: string
    vegetable: string
    herb: string
    fruit: string
    true: string
    false: string
    "4": string
    "3.5": string
    "3": string
    "organic-true": string
    "organic-false": string
}

export interface FilterConfig {
    [key: string]: {
        enabled: boolean;
        options: (string | boolean)[];
    };
}

export interface FilterOption {
    value: string | boolean;
    label: string;
}

export interface FilterState {
    [key: string]: string | boolean | null;
}

export interface ProductCardFeatures {
    showPrice: boolean;
    showDiscount: boolean;
    showRating: boolean;
    showTags: boolean;
    showStock: boolean;
    showNewBadge: boolean;
    showSaleBadge: boolean;
    showFeaturedBadge: boolean;
}

export interface ProductPageSort {
    enableSortBy: boolean;
    defaultSortBy: string;
    availableOptions: {
        [key: string]: string;
    };
}

export interface ProductPageFilters {
    enableFilters: boolean;
    availableOptions: FilterConfig;
    defaultState: {
        type: string | null;
        organic: boolean | null;
        available: boolean | null;
        rating: string | null;
    };
}

export interface ProductPageConfiguration {
    sections: {
        searchBar: boolean;
        sortControls: boolean;
        filterControls: boolean;
    };
    features: ProductCardFeatures;
    sort: ProductPageSort;
    filters: ProductPageFilters;
    displayData: DisplayData;
}

export interface ProductPageConfig {
    'products-page': ProductPageConfiguration;
    productsjson?: {
        title: string;
    };
}