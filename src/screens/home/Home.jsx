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
                setWatchlist(data); // <- your useState or similar
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
                                poster={`https://image.tmdb.org/t/p/w500${item.poster_link}`}
                                name={item.name}
                                year={item.year}
                                season={item.type === "tv" ? `S${item.season}` : null}
                                episode={item.type === "tv" ? `E${item.episode}` : null}
                                onClick={() =>
                                    navigate(`/show?id=${item.showId}&type=${item.type}`)
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