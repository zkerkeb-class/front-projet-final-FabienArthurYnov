import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login/Login.jsx";
import Logout from "./Logout/Logout.jsx";
import SignIn from "./signin/SignIn.jsx"

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/Login">Login</Link> 
      </nav>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
