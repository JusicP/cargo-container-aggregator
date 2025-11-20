import { useEffect } from "react";
import { useUser } from "@/contexts/hooks/useUser";
import { refreshAccessToken, getUserInfo } from "@/services/api/auth";

export const useAuth = () => {
    const { user, addUser, removeUser, setUser } = useUser();

    useEffect(() => {
        const init = async () => {
            try{
                const accessToken = await refreshAccessToken();
                if (accessToken) {
                    const userData = await getUserInfo();
                    setUser(userData);
                }
            } catch {
                setUser(null)
            }
        }

        init();
    }, [])

    const login = async () => {
        const newToken = await refreshAccessToken();
        const userData = await getUserInfo();
        addUser(userData);
    };

    const logout = () => {
        removeUser();
    };

    return { user, login, logout, setUser };
}