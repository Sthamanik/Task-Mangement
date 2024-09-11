import { Mail, User2Icon} from "lucide-react"

const Signup = () => {
  return (
    <div className=" bg-slate-50 h-full rounded-2xl xl:w-2/3 sm:w-full flex">
        <div className="h-full  bg-indigo-600 w-2/5 rounded-l-2xl py-12 px-10 flex items-center justify-center">
            <div className="text-center">
                <p className="text-slate-200 font-semibold text-2xl">
                    Welcome To Taskify
                </p>
                <p className="text-gray-300 text-sm font-semibold my-2">
                    Create and manage your tasks with ease
                </p>
            </div>
        </div>
        <div className="h-full w-3/5 bg-slate-50 rounded-r-2xl p-8 space-y-3 flex flex-col items-center">
            <h1 className="text-center text-xl font-semibold text-indigo-600"> SignUp</h1>
            <form action="#">
                <div className="mb-4">
                    <label htmlFor="userName" className="flex text-sm text-gray-600 font-semibold"><User2Icon/>Username </label>
                    <input
                        type="text"
                        className="border-2 border-solid border-gray-500 rounded-md p-1 w-full focus:outline-indigo-600 "
                        id="userName"
                        name="userName"
                        required
                        placeholder ="John Doe"
                    />
                </div>
                <div className="mb-4">
                <label htmlFor="email" className="flex text-sm text-gray-600 font-semibold"><Mail/>Email </label>
                    <input
                        type="text"
                        className="border-2 border-solid border-gray-500 rounded-md p-1 w-full focus:outline-indigo-600 "
                        id="email"
                        name="email"
                        required
                        placeholder="John@email.com"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="userName" className="flex text-sm text-gray-600 font-semibold"><User2Icon/>Username </label>
                    <input
                        type="text"
                        className="border-2 border-solid border-gray-500 rounded-md p-1 w-full focus:outline-indigo-600 "
                        id="userName"
                        name="userName"
                        required
                        placeholder ="John Doe"
                    />
                </div>
                <div className="mb-4">
                <label htmlFor="email" className="flex text-sm text-gray-600 font-semibold"><Mail/>Email </label>
                    <input
                        type="text"
                        className="border-2 border-solid border-gray-500 rounded-md p-1 w-full focus:outline-indigo-600 "
                        id="email"
                        name="email"
                        required
                        placeholder="John@email.com"
                    />
                </div>
            </form>
        </div>
    </div>
  )
}

export default Signup
