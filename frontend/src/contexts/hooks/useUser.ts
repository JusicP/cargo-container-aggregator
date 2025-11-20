import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { type User } from "@/contexts/contextInterfaces.ts"

export const useUser = () => {
    const { user, setUser } = useContext(AuthContext);

    const addUser = (user: User) => {
        setUser(user);
    };

    const removeUser = () => {
        setUser(null);
    };

    return { user, addUser, removeUser, setUser };
};
