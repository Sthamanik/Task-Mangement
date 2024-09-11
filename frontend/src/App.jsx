import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthConatainer from "./components/auth/AuthConatainer"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element= {<AuthConatainer/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
