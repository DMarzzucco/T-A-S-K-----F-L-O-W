import { createContext, useContext, useEffect, useState } from "react";
import { LoginRequest, RegisterRequest } from "../api/api";
import { ApiError, AuthContextType, AuthProvI, User, ValidationError } from "../ts/interfaces";
import Cookies from "js-cookie"

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
                    setFails([{ message: "Validation Error" }])
                }
            }
            else {
                setFails([{ message: "Server Error" }])
            }
        }
    }
    const signIn = async (user: User) => {
        try {
            const res = await LoginRequest(user);
            setUser(res.data)
            setIsAuth(true)
            setFails([])
        } catch (error) {
            console.error(error)
            if ((error as ApiError).response?.status === 400) {
                const axiosError = error as ApiError;
                const responseData = axiosError.response?.data;
                if (responseData?.errors) {
                    setFails(responseData?.errors);
                } else if (responseData?.error) {
                    setFails([{ message: responseData.error }])
                } else {
                    setFails([{ message: "Problem of Validation the count" }])
                }
            } else {
                setFails([{ message: "Server Error" }])
            }
        }
    }
    useEffect(() => {
        if (fails.length > 0) {
            const timer = setTimeout(() => {
                setFails([])
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [fails])

    useEffect(() => {
        const cookies = Cookies.get()
        console.log (cookies)
        if (cookies.token) {
            console.log(cookies.token);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ signUp, signIn, user, isAuth, fails }}>
            {children}
        </AuthContext.Provider>

    )
}