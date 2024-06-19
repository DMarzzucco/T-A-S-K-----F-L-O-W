import { createContext, useContext, useState } from "react";
import { RegisterRequest } from "../api/api";
import { AuthContextType, AuthProvI, User } from "../ts/interfaces";
import axios, { AxiosError } from "axios";

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
    const [fails, setFails] = useState<{message:string}[]>([])

    const signUp = async (user: User) => {
        try {
            const res = await RegisterRequest(user);
            setUser(res.data)
            setIsAuth(true)
            // setFails("")
            setFails([])

        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<any>;
                if (axiosError.response?.status == 400) {
                    if (Array.isArray(axiosError.response.data.errors)) {
                        setFails(axiosError.response.data.errors)
                    } else {
                        setFails([{message: axiosError.response.data.error || "error de validacion"}])
                    }
                }
                 else {
                    setFails([{message:"Error al registrar"}])
                }
            } 
            else {
                setFails([{message:"error del servidor"}])
            }
        }
    }

    return (
        <AuthContext.Provider value={{ signUp, user, isAuth, fails }}>
            {children}
        </AuthContext.Provider>

    )
}