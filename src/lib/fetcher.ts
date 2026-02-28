interface FetchItemsParams {
    path?: string;
    payload?: Record<string, unknown>;
}

export const FetchItems = async (fetchFor: FetchItemsParams) => {
    try {
        const res = await fetch(fetchFor.path as string);
        if (!res.ok) throw new Error(`Failed to fetch items from ${fetchFor.path}`);
        const data = await res.json();
        return {
            data,
            error: null,
            status: "S"
        };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: (error as Error).message,
            status: "E"
        }
    }
};
