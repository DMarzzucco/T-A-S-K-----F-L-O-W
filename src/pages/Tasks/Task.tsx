import { useAuth } from "../../context/Auth.context"

function Task() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <>
            <section className="flex flex-col justify-center items-center h-screen w-full">
                {typeof user !== 'string' && user && user.user && (
                    <h1>Welcome {user.user.username}</h1>
                )}

            </section>
        </>
    )
}
export default Task 