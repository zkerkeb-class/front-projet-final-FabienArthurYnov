import React from "react";
import "./Home.css";
import { useNavigate } from "react-router";

function Home() {
    const navigate = useNavigate();

    // placeholder arrays to simulate data
    const currentlyWatching = Array(8).fill("Current Show");
    const watchlist = Array(6).fill("Watchlist Show");
    const trending = Array(10).fill("Coming soon");

    return (
        <>
            <nav className="navbar">
                <div className="logo">SeenIt</div>
                <input className="search-bar" type="search" placeholder="Search..." />
                <div className="nav-links">
                    <button className="nav-btn">Watchlist</button>
                    <button className="nav-btn">Discover</button>
                    <button className="nav-btn logout-btn" onClick={() => navigate("/logout")}>Logout</button>
                </div>
            </nav>

            <main className="main-content">
                <section className="section">
                    <h2>Continue what you started</h2>
                    <div className="card-row">
                        {currentlyWatching.map((title, i) => (
                            <div key={i} className="card">{title}</div>
                        ))}
                    </div>
                </section>

                <section className="section">
                    <h2>Your Watchlist</h2>
                    <div className="card-row">
                        {watchlist.map((title, i) => (
                            <div key={i} className="card">{title}</div>
                        ))}
                    </div>
                </section>

                <section className="section">
                    <h2>Discover What's Trending</h2>
                    <div className="card-row">
                        {trending.map((title, i) => (
                            <div key={i} className="card">{title}</div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;