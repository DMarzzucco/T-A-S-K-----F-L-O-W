import { Link } from "react-router-dom"

function Task() {
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