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
        <li>
            <Link to={path} onClick={click}>
                <p>{title}</p>
            </Link>
        </li>
    )
}
