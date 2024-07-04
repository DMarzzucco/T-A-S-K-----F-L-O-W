import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth.context";
import { User } from "../../../ts/interfaces";

function UpdateUser() {
    const { register, handleSubmit } = useForm<User>();
    const { signUp, isAuth, fails } = useAuth()

    const nave = useNavigate();
    useEffect(() => {
        if (isAuth) {
            nave("/task");
        }
    }, [isAuth])

    const onSubmit = handleSubmit(async (value) => {
        signUp(value)
    })
    return (
        <>
            <section className="flex flex-col justify-center items-center w-full h-screen">
                <h1>Update</h1>

                {fails.length > 0 && (
                    <div className=" my-4">
                        {fails.map((error, index) => (
                            <p key={index} className="p-2 my-2 bg-red-500 text-white font-bold">
                                {error.message}
                            </p>
                        ))}
                    </div>
                )}
                <form onSubmit={onSubmit}
                    className="flex flex-col justify-center items-center">
                    {/* fullname */}
                    <input type="text" {...register("user.fullname")}
                        placeholder="Complete Name "
                        className="text-white"
                    />

                    {/* username  */}
                    <input type="text" {...register("user.username")}
                        placeholder="UserName "
                        className="text-white"
                    />
                    {/* Email */}
                    <input type="email" {...register("user.email")}
                        placeholder="Email" />
                    {/* Password */}
                    <input type="password" {...register("user.password")}
                        placeholder="Password" />

                    <button type="submit"> Sing Up</button>
                </form>
            </section>
        </>
    )
}
export default UpdateUser