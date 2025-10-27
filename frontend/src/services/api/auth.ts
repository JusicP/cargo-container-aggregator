import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {defaultAxiosInstance} from "@/services/axiosInstances.ts"

const signUpReqBody = {
    "name": "string",
    "email": "string",
    "phone_number": "string",
    "company_name": "string",
    "avatar_photo_id": 0,
    "password": "string",
    "role": "user"
}

export const useSignUpUser = () => {
    return useMutation({
        mutationFn: async (credentials: typeof signUpReqBody) => {
            await defaultAxiosInstance.post("/users/register", credentials);
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