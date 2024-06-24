import { useAuth } from "../../context/Auth.context";
import { HeaderLinks } from "../assets/assets";

function Header() {
    const { isAuth, logOut, user } = useAuth()

    return (
        <nav className="flex w-full flex-row justify-between items-center">
            <HeaderLinks path={"/"} title="Page " />
            <ul className="flex flex-row justify-center items-center">
                {isAuth ? (
                    <>
                        {typeof user !== 'string' && user ? (
                            <h1>welcome {user.username}</h1>
                        ) : (
                            <h1>Undefined</h1>
                        )}
                        <HeaderLinks path={"/profile"} title="Profile" />
                        <HeaderLinks path={"/"} click={() => { logOut() }} title="Logout" />
                    </>
                ) : (
                    <>
                        <HeaderLinks path={"/Login"} title="Login" />
                        <HeaderLinks path={"/Register"} title="Sign Up" />
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Header;