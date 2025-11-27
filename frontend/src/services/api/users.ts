import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultAxiosInstance } from "../axiosInstances";

export interface User {
    id: number;

    name: string;
    email: string;
    phoneNumber: string;
    companyName: string | null;

    role: string;
    registrationDate: string;
    status: string;

    avatarPhotoId: number | null;
}

export interface UserPaginatedGet {
    users: User[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
}

export interface UserFilters {
    searchQuery?: string;
    page?: number;
    pageSize?: number;
}

export const useUsers = (filters: UserFilters) => {
    return useQuery({
        queryKey: ["users", filters.page, filters.pageSize],
        queryFn: async () => {
            const params: any = { ...filters };

            const { data } = await defaultAxiosInstance.get<UserPaginatedGet>("/users", { params });
            return data;
        },
        refetchOnWindowFocus: false
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, status }: { userId: number; status: string }) => {
            await defaultAxiosInstance.put(`/users/${userId}/status/${status}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};
