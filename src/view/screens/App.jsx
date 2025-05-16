import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Login</Link> 
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
