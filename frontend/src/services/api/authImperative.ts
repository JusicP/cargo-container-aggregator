import { defaultAxiosInstance, privateAxiosInstance } from "@/services/axiosInstances.ts";

export const loginRequest = async (formData: FormData) => {
    const { data } = await defaultAxiosInstance.post("/auth/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const getUserInfo = async () => {
    const { data } = await privateAxiosInstance.get("/users/me");
    return data;
};

export const refreshAccessToken = async () => {
    const { data } = await defaultAxiosInstance.post("/auth/refresh/");
    console.log("refresh", data);
    return data;
};

export const logoutUser = async () => {
    await privateAxiosInstance.put("/auth/logout/");
    return;
};