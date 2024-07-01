import { HeaderLinks } from "../../components/assets/assets"
import { useAuth } from "../../context/Auth.context"

function Profile() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <>
            <section className="flex flex-col justify-center items-center w-full h-screen">
                <div className="flex flex-row justify-between w-full p-2 items-center">
                    {typeof user !== 'string' && user && user.user ? (
                        <h1>{user.user.fullname}</h1>
                    ) : (
                        <span>Undefined</span>
                    )}
                    <p>Task</p>
                </div>
                <div className="grid grid-cols-2 justify-center items-center">
                    <details className="flex flex-col justify-center items-center">
                        <summary>
                            Options
                        </summary>
                        <div className="flex flex-col justify-center items-center ">
                            <HeaderLinks path={"/delete"} title={"delete count"} />
                            <HeaderLinks path={"/update"} title={"edit count"} />
                        </div>
                    </details>
                </div>
            </section>
        </>
    )
}
export default Profile 