import { useForm } from "react-hook-form";
import { User } from "../../ts/interfaces";
import { useAuth } from "../../context/Auth.context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorFormRegister } from "../../components/assets/assets";

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm<User>();
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
                <h1>Register</h1>

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
                    {/* username  */}
                    <input type="text" {...register("username", { required: true })}
                        placeholder="UserName "
                        className="text-white"
                    />
                    {errors.username && <ErrorFormRegister title="Username is Required" />}
                    {/* Email */}
                    <input type="email" {...register("email", { required: true })}
                        placeholder="Email" />
                    {errors.email && <ErrorFormRegister title="Email is Required" />}
                    {/* Password */}
                    <input type="password" {...register("password", { required: true })}
                        placeholder="Password" />
                    {errors.password && <ErrorFormRegister title="Password is Required" />}

                    <button type="submit"> Sing Up</button>
                </form>
            </section>
        </>
    )
}

export default Register;