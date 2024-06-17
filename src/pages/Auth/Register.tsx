import { useForm } from "react-hook-form";
function Register() {
    const { register, handleSubmit } = useForm();
    return (
        <>
            <section className="flex flex-col justify-center items-center w-full h-screen">
                <h1>Register</h1>
                <form onSubmit={handleSubmit((value) => {
                    console.log(value);
                })}
                    className="flex flex-col justify-center items-center">
                    <input type="text" {...register("userName", { required: true })}
                        placeholder="UserName "
                        className="text-white"
                    />
                    <input type="email" {...register("email", { required: true })}
                        placeholder="Email" />
                    <input type="password" {...register("Password", { required: true })}
                        placeholder="Password" />
                    <button type="submit"> Sing Up</button>
                </form>
            </section>
        </>
    )
}

export default Register;