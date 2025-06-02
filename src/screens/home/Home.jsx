import React from "react";
import "./Home.css";
import { useNavigate } from "react-router";
import ShowCard from "../../component/ShowCard/ShowCard";
import Navbar from "../../component/Navbar/Navbar"

function Home() {
    const navigate = useNavigate();

    // placeholder arrays to simulate data
    const currentlyWatching = Array(8).fill("Current Show");
    const watchlist = Array(6).fill("Watchlist Show");
    const trending = Array(10).fill("Coming soon");

    return (
        <>
            <Navbar>

            </Navbar>

            <main className="main-content">
                <section className="section">
                    <h2>Continue what you started</h2>
                    <div className="card-row">
                        {currentlyWatching.map((title, i) => (
                            <ShowCard
                                poster="https://image.tmdb.org/t/p/w500/your-poster.jpg"
                                name={title}
                                year="2023"
                                season="S3"
                                episode="E10"
                                onClick={() => console.log("Card clicked!")}
                            />
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