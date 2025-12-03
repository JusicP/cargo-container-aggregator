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
import {tokenManager} from "@/contexts/tokenManager.ts";

// for triggering notifications
import { toaster } from "@/components/ui/toaster";

// For Make Log on Develop Mode
const logOnDev = (...args: any[]) => {
    if (import.meta.env.MODE === "development") {
        console.log("[AXIOS]", ...args);
    }
};

// promise base for preventing infinite refresh retries
let refreshPromise: Promise<string> | null = null;

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    // getting token from manager
    const token = tokenManager.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    logOnDev("REQUEST:", {
        method: config.method,
        url: config.url,
        headers: config.headers,
    });
    return config;
};

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
        toaster.error({
            title: "Unexpected error",
            description: error.message,
        });
        return Promise.reject(error);
    }

    const originalRequest = error.config as any;

    // connection / cors / user context (restrictions)
    if (!error.response) {
        if (error.request && error.config?.url?.includes("/users/me")) {
            return Promise.reject(new AuthExpiredError());
        }
        toaster.error({
            title: "Помилка мережі",
            description: "Перевірте з'єднання",
        });
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
            // Show toast immediately
            toaster.error({
                title: "Користувача не авторизовано",
                description: JSON.stringify(error?.response?.data.detail),
            });

            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    if (!refreshPromise) {
                        refreshPromise = refreshAccessToken()
                            .then((token) => {
                                tokenManager.setToken(token);
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
                    tokenManager.setToken(null);
                    toaster.error({
                        title: "Session expired",
                        description: "Please login again",
                    });
                    return Promise.reject(new AuthExpiredError());
                }
            }

            // Already retried
            tokenManager.setToken(null);
            return Promise.reject(new AuthExpiredError());
        }
        case 403: {
            //access denied
            toaster.create({ title: "Forbidden", description: "Access denied", type: "error", });
            return Promise.reject(new ForbiddenError());
        }
        case 404: {
            //invalid request
            toaster.create({ title: "Not found", description: "Resource does not exist", type: "error", });
            return Promise.reject(new NotFoundError());
        }
        case 500: {
            //server error
            toaster.create({ title: "Server error", description: "Something went wrong", type: "error", });
            return Promise.reject(new NetworkConnectionError());
        }
        case 429: {
            // rate limit over exceeded
            toaster.create({ title: "Too many requests", description: "Rate limit exceeded", type: "warning" });
            return Promise.reject(new RateLimitError());
        }
    }
    return Promise.reject(error);
}