import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthConatainer from "./components/auth/AuthConatainer";
import Applayout from "./components/Layouts/Applayout";
import Profile from "./components/Layouts/Profile";  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AuthConatainer />} />
        <Route path="/app/*" element={<Applayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
