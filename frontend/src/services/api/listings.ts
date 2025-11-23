import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultAxiosInstance } from "../axiosInstances";

export interface ListingPhoto {
    photo_id: number;
    is_main: boolean;
    listing_int: number;
    uploaded_at: string
}

export interface ListingAnalytics {
    listing_id: number;

    average_price: number | null;
    min_price: number | null;
    max_price: number | null;

    price_trend: object;

    views: number;
    contacts: number;
    favorites: number;

    updated_at: string;
}

export interface ListingHistory {
    price: number | null

    views: number
    contacts: number
    favorites: number
    
    addition_date: string | null
}

export interface Listing {
    id: number;
    title: string;
    description: string;
    container_type: string;
    condition: string;
    type: string;
    currency: string | null;
    location: string;
    ral_color: string | null;
    status: string;
    addition_date: string;
    approval_date: string | null;
    updated_at: string | null;
    photos?: ListingPhoto[];
    analytics?: ListingAnalytics;
    last_history: ListingHistory;
    original_url: string | null;
}

export interface ListingsPaginatedGet {
    listings: Listing[];
    total: number;
    total_pages: number;
    page: number;
    page_size: number;
}

export interface ListingFilters {
    title?: string;
    container_type?: string[];
    condition?: string[];
    type_?: string[];
    price_min?: number;
    price_max?: number;
    currency?: string;
    location?: string[];
    ral_color?: string[];
    status?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    page?: number;
    page_size?: number;
}

export const useListings = (filters: ListingFilters) => {
    return useQuery({
        queryKey: ["listings", filters.page, filters.page_size],
        queryFn: async () => {
            const params: any = { ...filters };
            // type_ -> type для backend
            if (params.type_) {
                params.type = params.type_;
                delete params.type_;
            }

            const { data } = await defaultAxiosInstance.get<ListingsPaginatedGet>("/listings", { params });
            return data;
        },
        refetchOnWindowFocus: false
    });
};

export const useUpdateListingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ listingId, status }: { listingId: number; status: string }) => {
            await defaultAxiosInstance.post(`/listings/${listingId}/status/${status}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["listings"] });
        },
    });
};
