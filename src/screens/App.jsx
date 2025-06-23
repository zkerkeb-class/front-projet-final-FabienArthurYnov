import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login/Login.jsx";
import Logout from "./Logout/Logout.jsx";
import SignIn from "./signin/SignIn.jsx";
import Home from "./home/Home.jsx";
import ProtectedRoute from "../security/Protected.jsx";
import AnonRoute from "../security/Anon.jsx";
import ShowPage from "./showPage/ShowPage.jsx";
import WatchlistShows from "./watchlistShows/watchlistShows.jsx";
import WatchedShows from "./watchedShows/watchedShows.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={
          <AnonRoute>
            <Login />
          </AnonRoute>} />
        <Route path="/SignIn" element={
          <AnonRoute>
            <SignIn />
          </AnonRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>} />
        <Route path="/show" element={
          <ProtectedRoute>
            <ShowPage />
          </ProtectedRoute>} />
        <Route path="/watched" element={
          <ProtectedRoute>
            <WatchedShows />
          </ProtectedRoute>} />
        <Route path="/watchlist" element={
          <ProtectedRoute>
            <WatchlistShows />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
