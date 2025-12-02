let accessToken: string | null = null;
let setTokenCallback: ((token: string | null) => void) | null = null;

export const tokenManager = {
    getToken: () => accessToken,

    setToken: (token: string | null) => {
        accessToken = token;
        console.log("[tokenManager] setToken:", token);
        if (setTokenCallback) setTokenCallback(token);
    },

    subscribe: (cb: (token: string | null) => void) => {
        setTokenCallback = cb;
        console.log("[tokenManager] subscribed");
    }
};