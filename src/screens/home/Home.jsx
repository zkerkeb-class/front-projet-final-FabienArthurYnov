import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router";
import ShowCard from "../../component/ShowCard/ShowCard";
import Navbar from "../../component/Navbar/Navbar"

function Home() {
    // placeholder arrays to simulate data
    const [watchlist, setWatchlist] = useState();
    const currentlyWatching = Array(8).fill("Current Show");
    const trending = Array(10).fill("Coming soon");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchWatchlist = async () => {
            const sessionToken = sessionStorage.getItem("loginToken");

            try {
                const res = await fetch(import.meta.env.VITE_SEENIT_API + "/api/watchlist", {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + sessionToken,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch watchlist");

                const data = await res.json();
                setWatchlist(data);
            } catch (err) {
                console.error("Watchlist fetch error:", err);
            }
        };  
        fetchWatchlist();
    })


    return (
        <>
            <Navbar>

            </Navbar>

            <main className="main-content">

                <section className="section">
                    <h2>Your Watchlist</h2>
                    <div className="card-row">
                        {watchlist && watchlist.map((item, i) => (
                            <ShowCard
                                key={item._id}
                                poster={`https://image.tmdb.org/t/p/w500${item.show.poster_link}`}
                                name={item.show.name}
                                year={item.show.year}
                                season={item.show.type === "tv" ? `S${item.season}` : 1}
                                episode={item.show.type === "tv" ? `E${item.episode}` : 1}
                                onClick={() =>
                                    navigate(`/show?id=${item.show.showId}&type=${item.show.type}`)
                                }
                            />
                        ))}
                    </div>
                </section>


                <section className="section">
                    <h2>Continue what you started</h2>
                    <div className="card-row">
                        {currentlyWatching.map((title, i) => (
                            <ShowCard
                                key={i}
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