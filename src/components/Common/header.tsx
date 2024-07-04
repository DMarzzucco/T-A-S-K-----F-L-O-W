import { useAuth } from "../../context/Auth.context";
import { HeaderLinks } from "../assets/assets";

function Header() {
    const { isAuth, logOut, user, loading } = useAuth()

    if (loading) {
        return (<div>Loading...</div>)
    }
    return (
        <nav className="px-1 flex w-full flex-row justify-between items-center">
            {isAuth ? (<HeaderLinks path={"/task"} title="Home " />) : (<HeaderLinks path={"/"} title="Page " />)}
            <ul className=" flex flex-row justify-center items-center">
                {isAuth ? (
                    <>
                        {typeof user !== 'string' && user && user.user && (
                            <HeaderLinks path={`/Profile/${user.user._id}`} title={user.user.username} />
                        )}
                        <HeaderLinks path={"/add-task"} title="New task" />
                        <HeaderLinks path={"/"} click={() => { logOut() }} title="Logout" />
                    </>
                ) : (
                    <>
                        <HeaderLinks path={"/Users"} title="Alles Users" />
                        <HeaderLinks path={"/Login"} title="Login" />
                        <HeaderLinks path={"/Register"} title="Sign Up" />
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Header;