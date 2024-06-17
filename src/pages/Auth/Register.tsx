import { useForm, SubmitHandler } from "react-hook-form";
import { RegisterRequest } from "../../api/api";
import { User } from "../../ts/interfaces";
import { useState } from "react";
import { Link } from "react-router-dom";
function Register() {
    const { register, handleSubmit } = useForm<User>();
    const [registerFull, setRegisterFull] = useState<boolean>(false);
    const [errorPass, setErrorPass] = useState<boolean>(false);

    const onSubmit: SubmitHandler<User> = async (data: User) => {
        console.log(data)
        if (data.password.length < 6) {
            setErrorPass(true)
            setTimeout(() => setErrorPass(false), 1000);
            return;
        }
        else {
            try {
                const res = await RegisterRequest(data);
                setRegisterFull(true);
                console.log(res)
            }
            catch (error) {
                console.error("Submit Error", error)
            }
        }

    }
    return (
        <>
            <section className="flex flex-col justify-center items-center w-full h-screen">
                <h1>Register</h1>
                <form onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col justify-center items-center">
                    <input type="text" {...register("username", { required: true })}
                        placeholder="UserName "
                        className="text-white"
                    />
                    <input type="email" {...register("email", { required: true })}
                        placeholder="Email" />
                    <input type="password" {...register("password", { required: true })}
                        placeholder="Password" />
                    {errorPass ?
                        <div className="flex justify-center items-center w-full bg-red-500 text-white ">
                            <h1>La contraseña debe ser de mas de 6 digitos</h1>
                        </div> : null}
                    <button type="submit"> Sing Up</button>
                </form>
                {registerFull ?
                    <div className="flex flex-col justify-center items-center">
                        <h1>Registro con existo <br /> ahora puede iniciar seccion</h1>
                        <Link to={"/login"} > Login </Link>
                    </div> : null}
            </section>
        </>
    )
}

export default Register;