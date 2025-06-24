import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router";
import ShowCard from "../../component/ShowCard/ShowCard";
import Navbar from "../../component/Navbar/Navbar"

function Home() {
    // placeholder arrays to simulate data
    const [watchlist, setWatchlist] = useState();
    const [startedList, setStartedList] = useState();
    const [discoverList, setDiscoverList] = useState();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");


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

        const fetchStartedList = async () => {
            const sessionToken = sessionStorage.getItem("loginToken");

            try {
                const res = await fetch(import.meta.env.VITE_SEENIT_API + "/api/startedShows", {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + sessionToken,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch startedShows");

                const data = await res.json();
                setStartedList(data);
            } catch (err) {
                console.error("StartedShows fetch error:", err);
            }
        }

        const fetchDiscoverList = async () => {
            try {
                const today = new Date();
                const currentYear = today.getFullYear();

                // One month ago
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                const oneMonthAgoStr = oneMonthAgo.toISOString().split("T")[0]; // Format: YYYY-MM-DD


                const res = await fetch(
                    `https://api.themoviedb.org/3/discover/tv?air_date.gte=${oneMonthAgoStr}&first_air_date_year=${currentYear}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: "Bearer " + import.meta.env.VITE_APP_TMDB_API_TOKEN,
                            Accept: "application/json",
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setDiscoverList(data.results);
            } catch (error) {
                console.error("Error fetching TV shows:", error);
            }
        }

        const fetchUsername = async () => {
            const sessionToken = sessionStorage.getItem("loginToken");

            try {
                const res = await fetch(import.meta.env.VITE_SEENIT_API + "/api/user", {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + sessionToken,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user");

                const data = await res.json();
                setUsername(data.pseudo);
            } catch (err) {
                console.error("User fetch error:", err);
            }
        }
        fetchWatchlist();
        fetchStartedList();
        fetchDiscoverList();
        fetchUsername();
    }, [])


    return (
        <>
            <Navbar>

            </Navbar>

            <main className="main-content">

                <h2 className="welcome">Welcome {username}</h2>

                <section className="section">
                    <h2>Your Watchlist</h2>
                    <div className="card-row">
                        {!watchlist || watchlist.length == 0 && (<>
                        <p>Nothing to watch ! Look at Discover, or start searching for movies or tv shows !</p>
                        </>)}
                        {watchlist && watchlist.map((item, i) => (
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


                <section className="section">
                    <h2>Continue what you started</h2>
                    <div className="card-row">
                        {!startedList || startedList.length == 0 && (<>
                        <p>You have no show started.</p>
                        </>)}
                        {startedList && startedList.map((item, i) => (
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


                <section className="section">
                    <h2>Discover What's Trending</h2>
                    <div className="card-row">
                        {discoverList && discoverList.map((item, i) => (
                            <ShowCard
                                key={item.id}
                                poster={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                name={item.name}
                                year={item.first_air_date}
                                onClick={() =>
                                    navigate(`/show?id=${item.id}&type=tv`)
                                }
                            />
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;