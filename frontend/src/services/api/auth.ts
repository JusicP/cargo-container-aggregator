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

export type SignInReqBody = Pick<SignUpReqBody, "name" | "password">;

export const useSignInUser = () => {
    return useMutation({
        mutationFn: async (credentials: SignInReqBody) => {
            console.log(credentials);
            const { data } = await defaultAxiosInstance.post("/auth/login", credentials);
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