import {useMutation} from "@tanstack/react-query";
import {defaultAxiosInstance, privateAxiosInstance} from "@/services/axiosInstances.ts"
import { type userData } from "@/schemas/authUserSchema.ts"

export interface SignUpReqBody {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    company_name?: string;
    avatar_photo_id?: number;
    role: "user";
}

export const useSignUpUser = () => {
    return useMutation({
        mutationFn: async (credentials: SignUpReqBody) => {
            console.log(credentials);
            const { data } = await defaultAxiosInstance.post("/users/register", credentials);
            return data;
        },
        onSuccess: () => {
            console.log("User registered successfully!");
        }
    })
}

export const useSignInUser = () => {
    return useMutation({
        mutationFn: async (credentials: FormData) => {
            console.log(credentials);
            const { data } = await defaultAxiosInstance.post(
                "/auth/login",
                credentials,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            return data;
        },
        onSuccess: () => {
            console.log("User logged in successfully!");
        }
    });
};

export const refreshAccessToken = async () => {
    try {
        const { data } = await defaultAxiosInstance.post("/auth/refresh", {});
        const newAccessToken = data.access_token;
        if (!newAccessToken) {
            throw new Error("No access token returned from refresh endpoint");
        }
        sessionStorage.setItem("accessToken", newAccessToken);

        return newAccessToken;
    } catch (err) {
        console.error("Token refresh failed:", err);
    }
}

export const getUserInfo = async () => {
    try {
        const { data } = await privateAxiosInstance.get<userData>("/users/me");
        return data;
    } catch (err) {
        console.error("Fetching user data failed", err);
    }
}