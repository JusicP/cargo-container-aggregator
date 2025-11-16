import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {defaultAxiosInstance} from "@/services/axiosInstances.ts"

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
        },
        onError: (err: any) => {
            if (axios.isAxiosError(err)) {
                console.log(err.status)
                console.error(err.response)
            } else {
                console.error(err);
            }
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
        },
        onError: (err: any) => {
            if (axios.isAxiosError(err)) {
                console.log(err.status);
                console.error(err.response);
            } else {
                console.error(err);
            }
        },
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
        sessionStorage.removeItem("accessToken");
        throw err;
    }
}