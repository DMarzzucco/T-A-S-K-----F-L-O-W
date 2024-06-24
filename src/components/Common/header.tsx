import { HeaderLinks } from "../assets/assets";

function Header() {
    return (
        <header className="w-full flex flex-row justify-between items-center">
            <h1>Header</h1>
            <nav className="flex flex-row justify-center items-center">
                <HeaderLinks path={"/"} title="Cabeza"/>
            </nav>
        </header>
    )
}

export default Header;