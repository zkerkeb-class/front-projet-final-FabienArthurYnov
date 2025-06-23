import React from "react";
import "./Navbar.css"; // Assuming CSS is in Card.css
import SearchBar from "./Searchbar/Searchbar";
import { useNavigate } from "react-router";


const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate("/")}>SeenIt</div>
            <SearchBar></SearchBar>
            <div className="nav-links">
                <button className="nav-btn" onClick={() => navigate("/watchlist")}>Watchlist</button>
                <button className="nav-btn" onClick={() => navigate("/watched")}>Rewatch</button>
                <button className="nav-btn logout-btn" onClick={() => navigate("/logout")}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
