import React, { useEffect, useState } from "react";
import "./watchedShows.css";
import { useNavigate } from "react-router";
import ShowCard from "../../component/ShowCard/ShowCard";
import Navbar from "../../component/Navbar/Navbar"

function watchedShows() {
    // placeholder arrays to simulate data
    const [watchedList, setWatcedList] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchWatchedlist = async () => {
            const sessionToken = sessionStorage.getItem("loginToken");

            try {
                const res = await fetch(import.meta.env.VITE_SEENIT_API + "/api/watched", {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + sessionToken,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch watchlist");

                const data = await res.json();
                setWatcedList(data);
            } catch (err) {
                console.error("Watchedlist fetch error:", err);
            }
        };

        fetchWatchedlist();
    })


    return (
        <>
            <Navbar>

            </Navbar>

            <main className="main-content">

                <section className="section">
                    <h2>Your Watchlist</h2>
                    <div className="card-row">
                        {!watchedList || watchedList.length == 0 && (<>
                        <p>Nothing watched yet ! Look at Discover, or continue what you started !</p>
                        </>)}
                        {watchedList && watchedList.map((item, i) => (
                            <ShowCard
                                key={item._id}
                                poster={`https://image.tmdb.org/t/p/w500${item.show.poster_link}`}
                                name={item.show.name}
                                year={item.show.year}
                                type={item.show.type}
                                season={item.show.type === "tv" ? `S${item.season}` : 1}
                                episode={item.show.type === "tv" ? `E${item.episode}` : 1}
                                onClick={() =>
                                    navigate(`/show?id=${item.show.showId}&type=${item.show.type}`)
                                }
                            />
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

export default watchedShows;