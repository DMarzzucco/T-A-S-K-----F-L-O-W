import { useEffect } from "react";
import { useAuth } from "../context/Auth.context";
// import { User } from "../ts/interfaces";

function AllesUsers() {
    const { user, showUsers } = useAuth()
    useEffect(() => { showUsers() }, [])

    const usersArray = Array.isArray(user) ? user : user ? [user] : [];
    return (
        <section className=" flex flex-col justify-center items-center h-screen w-full">
            <div>Alles Users</div>
            <div className="flex flex-col justify-center items-center">
                {/* {Array.isArray(user) ? (user.map((user: User, index) => (
                    <div key={index} className="flex flex-col justify-center items-center">
                        <h1>{user.user.fullname}</h1>
                        <ul className="flex flex-col justify-center items-center">
                            <li>{user.user._id}</li>
                            <li>{user.user.username}</li>
                            <li>{user.user.email}</li>
                        </ul>
                    </div>
                ))) : (<></>)} */}
                {usersArray.length > 0 ? (
                    usersArray.map((user, i) => (
                        user.user ? (
                            <div key={i} className="flex flex-col justify-center items-center">
                                <h1>{user.user.fullname}</h1>
                                <ul className="flex flex-col justify-center items-center">
                                    <li>{user.user._id}</li>
                                    <li>{user.user.username}</li>
                                    <li>{user.user.email}</li>
                                </ul>
                            </div>
                        ) : (<></>)
                    ))
                ) : (<></>)}
            </div>
        </section>
    )
}
export default AllesUsers;