import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultAxiosInstance } from "../axiosInstances";

export interface ListingParserBase {
    company_name: string
    method: string | null

    url: string
    location: string
    container_type: string
    condition: string
    type: string
    currency: string
}

export interface ListingParser extends ListingParserBase {
    id: number
    addition_date: string
    last_started_at: string | null
    last_finished_at: string | null

    status: string
    error_message: string
}

export interface ListingParserPaginatedGet {
    listings: ListingParser[];
    total: number;
    total_pages: number;
    page: number;
    page_size: number;
}

export interface ListingParserFilters {
    page?: number;
    page_size?: number;
}

export const useCreateListingParser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: ListingParserBase) => {
            const { data } = await defaultAxiosInstance.post("/parserlistings", formData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["listings"] });
        }
    })
}

export const useUpdateListingParser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ parserId, formData }: { parserId: number; formData: ListingParserBase }) => {
            const { data } = await defaultAxiosInstance.put(`/parserlistings/${parserId}`, formData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["listings"] });
        }
    })
}

export const useListingParser = (filters: ListingParserFilters) => {
    return useQuery({
        queryKey: ["listings", filters.page, filters.page_size],
        queryFn: async () => {
            const params: any = { ...filters };

            const { data } = await defaultAxiosInstance.get<ListingParserPaginatedGet>("/parserlistings", { params });
            return data;
        },
    });
};
