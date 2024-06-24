import { useAuth } from "../../context/Auth.context"

function Task() {
    const { user } = useAuth()
    return (
        <>
            <section className="flex flex-col justify-center items-center h-screen w-full">
                <h1>Task Page</h1>
                {typeof user !== 'string' && user ? (<h1>
                    Welcome {user.username}
                </h1>) : (<span>Undefined</span>)}

            </section>
        </>
    )
}
export default Task 