import { TitleType } from "../../ts/interfaces"

export const ErrorFormRegister: React.FC<TitleType> = ({ title }) => {
    return (
        <p className="p-1 text-red-700 font-bold">
            {title}
        </p>
    )
}