import { Link } from "react-router-dom"
import { HeaderLinksProps, TitleType } from "../../ts/interfaces"

export const ErrorFormRegister: React.FC<TitleType> = ({ title }) => {
    return (
        <p className="p-1 text-red-700 font-bold">
            {title}
        </p>
    )
}

export const HeaderLinks: React.FC<HeaderLinksProps> = ({ path, title, click }) => {
    return (
        <li className="list-none flex justify-center items-center m-2 border rounded-xl p-1 hover:bg-slate-300 hover:text-slate-900">
            <Link to={path} onClick={click}>
                <p>{title}</p>
            </Link>
        </li>
    )
}
