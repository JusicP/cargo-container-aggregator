import type {UserRole, UserStatus} from "@/contexts/AuthContext.tsx";

export interface User {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    company_name?: string;
    role: UserRole;
    registration_date: string;
    status: UserStatus;
    avatar_photo_id?: number | null;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone_number: string;
    company_name?: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: FormData) => Promise<void>;
    logout: () => void;
    register: (userData: RegisterData) => Promise<void>;
}