import { useAuth } from "../../context/Auth.context"

function Profile() {
    const { user } = useAuth()
    return (
        <>
            <section className="flex flex-col justify-center items-center w-full h-screen">
                <div className="flex flex-row justify-between w-full p-2 items-center">
                    {typeof user !== 'string' && user ? (
                        <h1>{user.fullname}</h1>
                    ) : (
                        <span>Undefined</span>
                    )}
                    <p>Task</p>
                </div>
            </section>
        </>
    )
}
export default Profile 