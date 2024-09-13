import { Route, Routes } from "react-router-dom"
import Signup from "./Signup"
import Login from "./Login"

const AuthConatainer = () => {
  return (
    <div className="bg-indigo-300 h-svh w-svw p-24 flex flex-col items-center justify-center">
       <Routes>
            <Route path= "/" element={<Login />} />
            <Route path= "/signup" element={<Signup />} />
       </Routes>
    </div>
  )
}

export default AuthConatainer
