export interface FilterOption {
    value: string;
    label: string;
    enabled?: boolean;
}

export interface FilterData {
    enabled: boolean;
    options: FilterOption[];
}

export interface Filters {
    [key: string]: {
        enabled: boolean;
        options: FilterOption[];
    };
}

export interface SelectedFilters {
    [key: string]: string;
}