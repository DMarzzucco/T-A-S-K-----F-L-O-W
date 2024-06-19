import { createContext, useContext, useState } from "react";
import { RegisterRequest } from "../api/api";
import { ApiError, AuthContextType, AuthProvI, User, ValidationError } from "../ts/interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth mus be used within an AuthProvider")
    }
    return context;
}
export const AuthProvider: React.FC<AuthProvI> = ({ children }) => {
    const [user, setUser] = useState<string>("")
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [fails, setFails] = useState<ValidationError[]>([])

    const signUp = async (user: User) => {
        try {
            const res = await RegisterRequest(user);
            setUser(res.data)
            setIsAuth(true)
            setFails([])

        } catch (error) {
            console.error(error)
            if ((error as ApiError).response?.status === 400) {
                const axiosError = error as ApiError;
                const responseData = axiosError.response?.data;
                if (responseData?.errors) {
                    setFails(responseData.errors);
                } else if (responseData?.error) {
                    setFails([{ message: responseData.error }])
                }
                else {
                    setFails([{ message: "Error al registrar" }])
                }
            }
            else {
                setFails([{ message: "error del servidor" }])
            }
        }
    }

    return (
        <AuthContext.Provider value={{ signUp, user, isAuth, fails }}>
            {children}
        </AuthContext.Provider>

    )
}