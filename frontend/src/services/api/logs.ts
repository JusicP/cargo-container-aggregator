import { useQuery } from "@tanstack/react-query";
import { defaultAxiosInstance } from "../axiosInstances";

export interface LogsGet {
    logs: string[];
    total: number;
    offset: number;
    limit: number;
}

export const LIMIT = 50;

export const useLogs = (offset: number) => {
    return useQuery({
        queryKey: ["logs", offset],
        queryFn: async () => {
            const params = {
                offset,
                limit: LIMIT,
            };

            const { data } = await defaultAxiosInstance.get<LogsGet>("/logs", { params });
            return data;
        },
    });
};

