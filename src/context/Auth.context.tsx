import { createContext, useContext, useEffect, useState } from "react";
import { AllesUsersRequest, LoginRequest, RegisterRequest, deleteUserResponse, logOutResponse, veryTokenResponse } from "../api/api";
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
const AuthProvider: React.FC<AuthProvI> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [fails, setFails] = useState<ValidationError[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    const showUsers = async () => {
        const res = await AllesUsersRequest()
        try {
            setUser(res);
        } catch (error) { }
    }
    const signUp = async (user: User) => {
        try {
            const res = await RegisterRequest(user);
            setUser(res.data)
            setUser(res)
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
            setUser(res)
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

    const logOut = async () => {
        const res = await logOutResponse();
        try {
            if (res) {
                Cookies.remove('token')
                setUser(null)
                setIsAuth(false);
            }
        } catch (error) {
            console.error("Logout failed", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (user: User) => {
        const res = await deleteUserResponse(user);
        try {
            if (!res) {
                console.log("Problem")
            }
            Cookies.remove('token')
            setUser(null)
            setIsAuth(false)
        } catch (error) {
            console.error(error)
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

    const verifyToken = async () => {
        const cookies = Cookies.get()
        if (!cookies.token) {
            setIsAuth(false);
            setLoading(false);
            setUser(null)
            return
        }
        try {
            const res = await veryTokenResponse();
            if (!res) {
                setIsAuth(false)
                setLoading(false)
                setUser(null)
                return;
            }
            setIsAuth(true)
            setUser(res);
        } catch (error) {
            setIsAuth(false)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => { verifyToken(); }, [])


    //  const updateUser = async () => {
    //     const res = await updateUserResponse()
    //     if (!res) {
    //         console.log("fallo la respuesta")
    //     }
    //     setUser(res)
    // }

    return (
        <AuthContext.Provider value={{ showUsers, signUp, signIn, logOut, deleteUser, user, isAuth, fails, loading }}>
            {children}
        </AuthContext.Provider>

    )
}

export default AuthProvider