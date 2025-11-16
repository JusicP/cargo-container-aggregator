import type {AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig} from "axios";
import axios from "axios";
import { refreshAccessToken } from "@/services/api/auth.ts";
import {
    AuthExpiredError,
    NetworkConnectionError,
    ForbiddenError,
    NotFoundError,
    RateLimitError
} from "@/services/errors/ErrorClasses.ts"

// For Make Log on Develop Mode
const logOnDev = (...args: any[]) => {
    if (import.meta.env.MODE === "development") {
        console.log("[AXIOS]", ...args);
    }
};

// promise base for preventing infinite refresh retries
let refreshPromise: Promise<string> | null = null;

export const requestInterceptor =
    async (config: InternalAxiosRequestConfig) => {
        // checking existing token (if exist) in sessionStorage : TO REFACTOR
        const accessToken = sessionStorage.getItem("accessToken")
        // embedding within existing headers if there is one
        // no token - error interceptor catch
        if (accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
            };
        }

        logOnDev("REQUEST:", {
            method: config.method,
            url: config.url,
            headers: config.headers,
        });

        return config;
    }

export const responseInterceptor =
    async (response: AxiosResponse) => {
        // just logging , token error - interceptor catch
        logOnDev("RESPONSE:", {
            method: response.config?.method,
            url: response.config?.url,
            status: response.status,
        });
        return response;
    }

export const errorInterceptor =
async (error: AxiosError | Error) => {
    // js failure catch
    if (!axios.isAxiosError(error)) {
        logOnDev("NON-AXIOS ERROR:", error.message);
        return Promise.reject(error);
    }

    const originalRequest = error.config as any;
    // connection / cors
    if (!error.response) {
        console.error("Network error:", error.message);
        return Promise.reject(new NetworkConnectionError());
    }

    const { method, url } = error.config as AxiosRequestConfig;
    const { status } = error.response as AxiosResponse ?? {};
    logOnDev("API ERROR:", {
        method,
        url,
        status,
        message: error.message,
    });

    switch (status) {
        case 401: {
            if(!originalRequest._retry) {
                console.warn("Already retried once. Failing.");
                sessionStorage.removeItem("accessToken");
                return Promise.reject(new AuthExpiredError());
            }
            originalRequest._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken()
                        .then((token) => {
                            sessionStorage.setItem("accessToken", token);
                            return token;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }
                const newAccessToken = await refreshPromise;
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return axios(originalRequest);
            } catch (refreshError) {
                console.error("REFRESH FAILED:", refreshError);
                sessionStorage.removeItem("accessToken");
                return Promise.reject(new AuthExpiredError());
            }
        }
        case 403: {
            //access denied
            return Promise.reject(new ForbiddenError());
        }
        case 404: {
            //invalid request
            return Promise.reject(new NotFoundError());
        }
        case 500: {
            //server error
            return Promise.reject(new NetworkConnectionError());
        }
        case 429: {
            // rate limit over exceeded
            return Promise.reject(new RateLimitError());
        }
    }
    return Promise.reject(error);
}