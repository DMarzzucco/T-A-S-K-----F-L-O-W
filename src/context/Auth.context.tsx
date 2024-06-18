import { createContext, useContext, useState } from "react";
import { RegisterRequest } from "../api/api";
import { AuthContextType, AuthProvI, User } from "../ts/interfaces";

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
    const [fails, setFails] = useState<string[]>([])

    const signUp = async (user: User) => {
        try {
            const res = await RegisterRequest(user);
            setUser(res.data)
            setIsAuth(true)
        } catch (error) {
            // const err = error as User;
            console.error (error)
            if (typeof error === 'string'){
                setFails(prevError =>[...prevError,error]);
            } else if (error instanceof Error){
                setFails(prevErrors => [...prevErrors, error.message]);
            } else if (typeof error === 'object' && error  && 'response'in error && error.response?.data ){
                setFails (prevErrors => [...prevErrors, error.response.data])
            }

            // console.error('Error during sign up ', error)
            // if (error instanceof Error) {
            //     setFails(prevError => [...prevError, error.message]);
            // } else if (typeof error === "string") {
            //     setFails(prevError =>[...prevError,error]);
            // } else if (typeof error === 'object' && error && 'response'in error && error.response?.data){}

        }
    }

    return (
        <AuthContext.Provider value={{ signUp, user, isAuth, fails }}>
            {children}
        </AuthContext.Provider>

    )
}