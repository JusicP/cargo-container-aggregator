//import {defaultAxiosInstance} from "./axiosInstances.ts";
import type {AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig} from "axios";
import axios from "axios";

// For Make Log on Develop Mode
const logOnDev = (message: string) => {
    if (import.meta.env.MODE === "development") {
        console.log(message);
    }
};

export const requestInterceptor =
    async (config: InternalAxiosRequestConfig) => {
        const { method, url } = config;

        const accessToken = sessionStorage.getItem("accessToken")
        if (accessToken) {
            //setting token inside headers
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        } else {
            //waiting for backend implementation -- call to refresh token
            /*
                const newAccessToken = defaultAxiosInstance.put()
                sessionStorage.setItem("accessToken", newAccessToken);
            */
        }
        //logging for debugging purposes (development mode)
        logOnDev(`[axios API] ${method?.toUpperCase()} ${url} | Request`);
        if (method === "get") {
            config.timeout = 15000;
        }

        return config;
    }

export const responseInterceptor =
    async (response: AxiosResponse) => {
        const { method, url } = response.config;
        const { status } = response;

        //logging for debugging purposes (development mode)
        logOnDev(`[axios API] ${method?.toUpperCase()} ${url} | Response ${status}`);

        //TO DO: additional response processing and formatting (in question)

        return response;
    }

export const errorInterceptor =
async (error: AxiosError | Error) => {
    if(axios.isAxiosError(error)) {
        const { message } = error;
        const { method, url } = error.config as AxiosRequestConfig;
        const { status } = error.response as AxiosResponse ?? {};

        //logging for debugging purposes (development mode)
        logOnDev(
            ` [axios API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
        );
        switch (status) {
            case 401: {
                //unauthenticated user, expired token
                sessionStorage.removeItem("accessToken");
                //navigate user (when router will be done)
                break;
            }
            case 403: {
                //access denied
                break;
            }
            case 404: {
                //invalid request
                break;
            }
            case 500: {
                //server error
                break;
            }
            default: {
                //unknown error
                break;
            }
        }
    } else {
        logOnDev(`[axios API] | Error ${error.message}`);
    }
    return Promise.reject(error);
}