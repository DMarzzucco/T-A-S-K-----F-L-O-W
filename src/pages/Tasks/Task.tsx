import { Link } from "react-router-dom"
import { useAuth } from "../../context/Auth.context"

function Task() {
    const { user } = useAuth()
    console.log(user)
    return (
        <>
            <section className="flex flex-col justify-center items-center h-screen w-full">
                <h1>Task Page</h1>
                <ul>
                    <Link to={"/profile"}> Profile </Link>
                </ul>

            </section>
        </>
    )
}
export default Task 