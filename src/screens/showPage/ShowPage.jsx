import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ShowPage.css";
import Navbar from "../../component/Navbar/Navbar";

const ShowPage = () => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [episodeProgress, setEpisodeProgress] = useState(1);
  const [providers, setProviders] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_url = import.meta.env.VITE_SEENIT_API;
  const loginToken = sessionStorage.getItem("loginToken");
  const [seasonProgress, setSeasonProgress] = useState(3);

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

    async function checkWatchlist() {
      try {
        const res = await fetch(API_url + `/api/watchlist/check?showId=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        });
        const data = await res.json();
        setInWatchlist(data.inWatchlist);
      } catch (error) {
        console.error("Failed to check watchlist status", error);
      }
    }

    if (id && type) {
      fetchShow();
      checkWatchlist();
    }


  }, [id, type, navigate]);

  const toggleWatchlist = async () => {
    const watchlistData = {
      showId: results.id,
      name: results.name || results.title,
      year: (results.first_air_date || results.release_date || "").slice(0, 4),
      type: type,
      poster_link: results.poster_path,
      episode: 0,
      season: 0,
    };

    try {
      const res = await fetch(API_url + "/api/watchlistToggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
        body: JSON.stringify(watchlistData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur:", data.error || data.message);
      } else {
        console.log("Succès:", data.message);
        setInWatchlist((prev) => !prev);
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    }
  };

  const changeSeason = (amount) => {
    setSeasonProgress((prev) => Math.min(Math.max(1, prev + amount), results.number_of_seasons));
    setEpisodeProgress(1);
  };

  const changeEpisode = (amount) => {
    let newEpisode = episodeProgress + amount;
    let newEpisodeFinal = newEpisode;

    if (newEpisode < 1) {
      if (seasonProgress - 1 > 0) {
        changeSeason(-1);
        newEpisodeFinal = (results.seasons[seasonProgress - 1].episode_count);
      }
    } else if (newEpisode > results.seasons[seasonProgress].episode_count) {
      changeSeason(1);
      newEpisodeFinal = 1
    } else {
    }
    setEpisodeProgress(newEpisodeFinal);
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
                Release Date: {results.first_air_date || results.release_date || "Unknown"} {type == "tv" && (<>, Last Air Date : {results.last_air_date}</>)}
              </p>
              <p className="country">
                Country: {results.origin_country || "Unknown"}
              </p>
              <p className="status">
                Status: {results.status || "Unknown"}
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
                {type == "tv" && (<>
                  <div className="season-progress">
                    <span>{results.seasons[seasonProgress].name}</span>
                  </div>
                  <div className="episode-progress">
                    <span>Episode: {episodeProgress} / {results.seasons[seasonProgress].episode_count}</span>
                    <button onClick={() => changeEpisode(-1)}>-</button>
                    <button onClick={() => changeEpisode(1)}>+</button>
                  </div>
                </>)}
                <button onClick={toggleWatchlist} className="watchlist-btn">
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShowPage;
