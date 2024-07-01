import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.context";
import { useEffect, useState } from "react";

function AuthRoutes() {
    const { isAuth, loading } = useAuth()
    const [showLoading, setShowLoading] = useState<boolean>(true)

    const nav = useNavigate();

    useEffect(() => {
        let timeoutID: NodeJS.Timeout | undefined;
        if (!loading) {
            setShowLoading(true)
        }
        console.log("Loading:", loading, "isAuth:", isAuth)
        timeoutID = setTimeout(() => {
            nav("/task");
            nav("/profile")
            setShowLoading(false);
        }, 500);
        return () => {
            if (timeoutID) {
                clearInterval(timeoutID)
            }
        };
    }, [loading, isAuth, nav])

    if (!isAuth) {
        return (
            <Navigate to={"/login"} replace />
        )
    }

    if (showLoading) {
        return (<div>esta cargando perfectamente...</div>)
    }


    return (<Outlet />)
}
export default AuthRoutes;