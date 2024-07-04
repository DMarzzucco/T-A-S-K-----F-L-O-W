import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.context";
import { useEffect } from "react";

function AuthRoutes() {
    const { isAuth, loading } = useAuth()

    const nav = useNavigate();

    useEffect(() => {
        if (loading) {
            return (nav("/task"))
        }
    }, [loading])

    if (!isAuth && !loading) {
        return (
            <Navigate to={"/login"} replace />
        )
    }

    return (<Outlet />)
}
export default AuthRoutes;