import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthConatainer from "./components/auth/AuthConatainer"
import Applayout from "./components/Layouts/Applayout"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element= {<AuthConatainer/>}/>
        <Route path="/taskify/*" element= {<Applayout/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
