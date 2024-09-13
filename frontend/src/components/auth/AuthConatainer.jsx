import { Route, Routes } from "react-router-dom"
import Signup from "./Signup"
import Login from "./Login"
import logo from '../../assets/img/image.png'

const AuthConatainer = () => {
  return (
    <>
    <div className="absolute flex space-x-2 items-center left-12 top-8 ">
      <img src={logo} alt="logo" className="object-cover rounded-full h-12 w-12" />
      <p className="text-xl font-extrabold tracking-widest text-slate-600">TASKIFY</p>
    </div>
    <div className="bg-indigo-300 h-svh w-svw p-24 flex flex-col items-center justify-center">
       <Routes>
            <Route path= "/" element={<Login />} />
            <Route path= "/signup" element={<Signup />} />
       </Routes>
    </div>
    </>
  )
}

export default AuthConatainer
