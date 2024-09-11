import { Route, Routes } from "react-router-dom"
import Signup from "./Signup"
import Login from "./Login"

const AuthConatainer = () => {
  return (
    <div className="bg-indigo-300 h-svh w-svw p-24 flex items-center justify-center">
       <Routes>
            <Route path= "/" element={<Signup />} />
            <Route path= "/signup" element={<Signup />} />
            <Route path= "/login" element={<Login />} />
       </Routes>
    </div>
  )
}

export default AuthConatainer
