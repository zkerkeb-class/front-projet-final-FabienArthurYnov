import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ShowPage.css";
import Navbar from "../../component/Navbar/Navbar";

const ShowPage = () => {
  const [watchList, setwatchList] = useState(false);
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
  const [seasonProgress, setSeasonProgress] = useState(1);
  const [done, setDone] = useState(false);
  const [episodeImage, setEpisodeImage] = useState("");
  const [episodeName, setEpisodeName] = useState("");

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

    async function checkProgress() {
      try {
        const res = await fetch(API_url + `/api/showuserlist/check?showId=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        });
        const data = await res.json();
        if (data == null) {
          setwatchList(false);
          setEpisodeProgress(1);
          setSeasonProgress(1);
          setDone(false);
          fetchEpisodeInfo(1, 1);
        } else {
          const season = parseInt(data.season, 10);
          const episode = parseInt(data.episode, 10);
          setwatchList(data.watchList);
          setEpisodeProgress(episode);
          setSeasonProgress(season);
          setDone(data.done);
          fetchEpisodeInfo(season, episode);
        }
      } catch (error) {
        console.error("Failed to check watchlist status", error);
      }
    }

    if (id && type) {
      fetchShow();
      checkProgress();
    } else {
      navigate("/");
    }
  }, [id, type, navigate]);


  const fetchEpisodeInfo = async (season = seasonProgress, episode = episodeProgress) => {
    if (type != "tv") { return; }

    const url = new URL("https://api.themoviedb.org/3/tv/" + id + "/season/" + season + "/episode/" + episode);

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
      };
      const data = await response.json();

      setEpisodeImage(data.still_path);
      setEpisodeName(data.name);
    } catch (error) {
      console.error("Fetch episode error: ", error)
    };
  }
  const toggleWatchlist = async () => {
    const newWatchList = !watchList;
    setwatchList(newWatchList);
    await updateShowUsersList(episodeProgress, seasonProgress, newWatchList);
  }

  const updateShowUsersList = async (newEpisode = episodeProgress, newSeason = seasonProgress, newWatchList = watchList, newDone = done) => {
    const updateShowUsersList = {
      show: {
        showId: results.id,
        name: results.name || results.title,
        year: (results.first_air_date || results.release_date || "").slice(0, 4),
        type: type,
        poster_link: results.poster_path,
      },
      episode: newEpisode,
      season: newSeason,
      watchList: newWatchList,
      done: newDone,
    };

    try {
      const res = await fetch(API_url + "/api/showuserlist/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
        body: JSON.stringify(updateShowUsersList),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur:", data.error || data.message);
      } else {
        console.log("Succès:", data.message);
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    }
  };

  const changeSeason = async (amount) => {
    const newSeason = Math.min(Math.max(1, seasonProgress + amount), results.number_of_seasons)
    const newEpisode = 1;
    setSeasonProgress(newSeason);
    setEpisodeProgress(newEpisode);
    await updateShowUsersList(newEpisode, newSeason, watchList);
    return newSeason;
  };

  const changeEpisode = async (amount) => {
    var newEpisode = episodeProgress + amount;
    var newSeason = seasonProgress;
    var newDone = false
    if (!results.seasons[seasonProgress]) { // only one season / no season
      newEpisode = Math.min(Math.max(1, episodeProgress + amount), results.number_of_episodes)
      if (newEpisode == results.number_of_episodes) {
        newDone = true;
      }
    } else { // multiple seasons
      if (newEpisode < 1) {
        if (seasonProgress - 1 > 0) {
          newSeason = await changeSeason(-1);
          newEpisode = (results.seasons[seasonProgress - 1].episode_count);
        } else {
          newEpisode = episodeProgress;
        }
      } else if (newEpisode > results.seasons[seasonProgress].episode_count) {
        if (results.number_of_seasons >= seasonProgress + 1) {
          newSeason = await changeSeason(1);
          newEpisode = 1;
        } else {
          newEpisode = episodeProgress;
        }
      } else {
        newEpisode = episodeProgress + amount;
      }
      if (newSeason == results.number_of_seasons && newEpisode == results.seasons[seasonProgress].episode_count) {
        newDone = true;
      }
    }

    setDone(newDone);
    setEpisodeProgress(newEpisode);
    await fetchEpisodeInfo(newSeason, newEpisode);
    await updateShowUsersList(newEpisode, newSeason, watchList, newDone);
  };

  const toggleDone = async () => {
    const newDone = !done;
    setDone(newDone);
    await updateShowUsersList(episodeProgress, seasonProgress, watchList, newDone);
  }


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

              <div className="actions">
                {type == "tv" && (<>
                  {results.seasons[seasonProgress] && (<>
                    <div className="season-progress">
                      <span>{results.seasons[seasonProgress].name} / {results.number_of_seasons}</span>
                    </div>
                  </>)}
                  <div className="episode-progress">
                    <span>Episode: {episodeProgress} / {results.seasons[seasonProgress] && (<>{results.seasons[seasonProgress].episode_count}</>) || <>{results.number_of_episodes}</>}</span>
                    <button onClick={() => changeEpisode(-1)}>-</button>
                    <button onClick={() => changeEpisode(1)}>+</button>
                  </div>

                  <div className="episode-card">
                    <img src={`https://image.tmdb.org/t/p/w500${episodeImage}`} alt="Episode Thumbnail" class="episode-img" />
                    <div className="episode-title">{episodeName}</div>
                  </div>

                  {done && (<>
                    <button className="done">
                      Watched it all !
                    </button>
                  </>)}
                </>)}

                {type == "movie" && (<>
                  {done && (
                    <button className="done" onClick={() => toggleDone()}>
                      Watched
                    </button>
                  )}
                  {!done && (
                    <button onClick={() => toggleDone()}>
                      Not Watched
                    </button>
                  )}
                </>)}

                <button onClick={toggleWatchlist} className="watchlist-btn">
                  {watchList ? "Remove from Watchlist" : "Add to Watchlist"}
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
