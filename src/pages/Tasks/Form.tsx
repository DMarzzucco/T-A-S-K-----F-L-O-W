import { useForm } from "react-hook-form"

function Form() {
    const { register, handleSubmit } = useForm()
    const onSubmit = handleSubmit(async (data) => {
        console.log(data)
    })
    return (
        <>
            <section className="flex flex-col justify-center items-center w-full h-screen">
                <h1>Form task</h1>
                <form onSubmit={onSubmit}
                    className="flex flex-col justify-center items-center">
                    <input type="text" placeholder="title"
                        {...register("title")} autoFocus />
                    <textarea rows={3} placeholder="Description"
                        {...register("description")}></textarea>
                    <button>Save</button>
                </form>
            </section>
        </>
    )
}
export default Form 