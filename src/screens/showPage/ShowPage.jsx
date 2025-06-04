import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ShowPage.css";
import Navbar from "../../component/Navbar/Navbar";

const ShowPage = () => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [episodeProgress, setEpisodeProgress] = useState(0);
  const [providers, setProviders] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      setLoading(true);
      let url = "";

      if (type === "movie") {
        url = new URL("https://api.themoviedb.org/3/movie/" + id);
      } else if (type === "tv") {
        url = new URL("https://api.themoviedb.org/3/tv/" + id);
      } else {
        console.error("Invalid type");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: "Bearer " + import.meta.env.VITE_APP_TMDB_API_TOKEN,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchShow();
    }
  }, [id, type, navigate]);

  const toggleWatchlist = () => {
    setInWatchlist((prev) => !prev);
  };

  const changeEpisode = (amount) => {
    setEpisodeProgress((prev) => Math.max(0, prev + amount));
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="show-page">
        {results && (
          <>
            <div className="poster">
              <img
                src={`https://image.tmdb.org/t/p/w500${results.poster_path}`}
                alt={results.name || results.title}
              />
            </div>

            <div className="details">
              <h1>{results.name || results.title}</h1>
              <p className="release-date">
                Release Date: {results.first_air_date || results.release_date || "Unknown"}
              </p>
              <p className="overview"> {results.overview}</p>

              <div className="providers">
                <strong>Available on:</strong>
                <ul>
                  {providers.map((provider, idx) => (
                    <li key={idx}>{provider}</li>
                  ))}
                </ul>
              </div>

              <div className="actions">
                <button onClick={toggleWatchlist} className="watchlist-btn">
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>

                {type == "tv" && (<>
                  <div className="episode-progress">
                    <span>Episode: {episodeProgress}</span>
                    <button onClick={() => changeEpisode(-1)}>-</button>
                    <button onClick={() => changeEpisode(1)}>+</button>
                  </div>
                </>)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShowPage;
