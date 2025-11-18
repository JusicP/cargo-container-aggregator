// src/services/api/listings.ts
import { useQuery } from "@tanstack/react-query";
import { defaultAxiosInstance } from "../axiosInstances";

interface ListingPhoto {
    photo_id: number;
    is_main: boolean;
    listing_int: number;
    uploaded_at: string
}

export interface Listing {
    id: number;
    title: string;
    description: string;
    container_type: string;
    condition: string;
    type: string;
    price: number | null;
    currency: string | null;
    location: string;
    ral_color: string | null;
    status: string;
    addition_date: string;
    approval_date: string | null;
    updated_at: string | null;
    photos?: ListingPhoto[];
    analytics?: any;
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
    });
};
