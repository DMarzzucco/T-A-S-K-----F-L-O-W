import { Link } from "react-router-dom";

function HeaderLR() {
    return (
        <>
            <header className="flex flex-row justify-between items-center">
                <h1>Social Media</h1>
                <div className="flex flex-row justify-between items-center w-300 ">
                    <Link to={"/Login"}>Login</Link>
                    <Link to={"/Register"}>Singe Up</Link>
                </div>
            </header>
        </>
    )
}

export default HeaderLR;