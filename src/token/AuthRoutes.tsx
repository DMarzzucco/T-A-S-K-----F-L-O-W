import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth.context";

function AuthRoutes() {
    const { user, isAuth } = useAuth()
    if (!isAuth) {
        return <Navigate to={"/login"} replace />
    }
    return (<Outlet />)
}
export default AuthRoutes;