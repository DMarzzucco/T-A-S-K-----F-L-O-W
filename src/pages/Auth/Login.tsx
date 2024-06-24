import { useForm } from "react-hook-form";
import { User } from "../../ts/interfaces";
import { ErrorFormRegister } from "../../components/assets/assets";
import { useAuth } from "../../context/Auth.context";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<User>();
    const { signIn, isAuth, fails } = useAuth()

    // const nave = useNavigate();
    // useEffect(() => {
    //     if (isAuth) {
    //         nave("/task")
    //     }
    // }, [isAuth])


    const onSubmit = handleSubmit(async (data) => {
        signIn(data)
    })
    return (
        <>
            <section className="flex flex-col justify-center items-center h-screen w-full">
                <div className="flex flex-col justify-center items-center">
                    <h1>Login Now</h1>
                    {fails.length > 0 && (
                        <div className="my-4">
                            {fails.map((error, index) => (
                                <p key={index} className="p-2 my-2 bg-red-500 text-white">
                                    {error.message}
                                </p>
                            ))}
                        </div>
                    )}
                    <form onSubmit={onSubmit}
                        className="flex flex-col justify-center items-center">

                        <input type="text"{...register("username", { required: true })}
                            placeholder="Username" />
                        {errors.username && <ErrorFormRegister title="Username is Required" />}
                        {/*  */}
                        <input type="password" {...register("password", { required: true })}
                            placeholder="Password" />
                        {errors.password && <ErrorFormRegister title="Password is Required" />}

                        <button type="submit">Login</button>
                    </form>
                    <p>Registrate aqui si no tienes cuenta <Link to={"/Register"}>Resgistrate</Link></p>
                </div>
            </section>
        </>
    )
}
export default Login;