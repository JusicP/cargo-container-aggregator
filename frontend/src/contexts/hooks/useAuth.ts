import { useUser } from "@/contexts/hooks/useUser";
import { loginRequest, getUserInfo, refreshAccessToken } from "@/services/api/authImperative";

export const useAuth = () => {
    const { user, addUser, removeUser, setUser } = useUser();

    const login = async (credentials: FormData) => {
        const loginRes = await loginRequest(credentials);  // backend sets HttpOnly cookie
        if (!loginRes) return;

        const userData = await getUserInfo();
        addUser(userData);
    };

    const logout = async () => {
        removeUser();
        // /logout endpoint
    };

    const refresh = async () => {
        const { res } = await refreshAccessToken();
        if (!res?.access_token) {
            removeUser();
            return null;
        }

        const userData = await getUserInfo();
        setUser(userData);
        return userData;
    };

    return { user, login, logout, refresh };
};