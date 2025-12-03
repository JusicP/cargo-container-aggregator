import {useMutation} from "@tanstack/react-query";
import {defaultAxiosInstance, privateAxiosInstance} from "@/services/axiosInstances.ts"
import { type userData } from "@/schemas/authUserSchema.ts"

// for triggering notifications
import { toaster } from "@/components/ui/toaster";

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
            toaster.success(
                {title: "Signed up successfully!",}
            );
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
            toaster.success(
                {title: "Signed in successfully!",}
            );
        }
    });
};

export const refreshAccessToken = async () => {
    await defaultAxiosInstance.post("/auth/refresh", {});
}

export const getUserInfo = async () => {
    const { data } = await privateAxiosInstance.get<userData>("/users/me");
    return data;
}