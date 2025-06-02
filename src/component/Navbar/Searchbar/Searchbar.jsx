import React, { useState, useEffect, useRef } from "react";
import "./Searchbar.css";

const tmdbApiToken = import.meta.env.VITE_APP_TMDB_API_TOKEN;

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef(null);

    const fetchResults = async (searchTerm) => {
        setLoading(true);

        const url = new URL("https://api.themoviedb.org/3/search/multi");
        url.searchParams.append("query", searchTerm);
        url.searchParams.append("include_adult", "false");
        url.searchParams.append("language", "fr-FR");
        url.searchParams.append("page", "1");

        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + tmdbApiToken,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Normalize results: get name/title + year from release date / first air date
            const normalized = data.results
                .filter((item) => item.media_type === "tv" || item.media_type === "movie")
                .slice(0, 10) // max 10 results
                .map((item) => {
                    const title = item.name || item.title || "No title";
                    const dateStr = item.first_air_date || item.release_date || "";
                    const year = dateStr ? new Date(dateStr).getFullYear() : "----";
                    return { id: item.id, title, year };
                });

            setResults(normalized);
        } catch (error) {
            console.error("Fetch error:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (query.length >= 3) {
                fetchResults(query);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(debounceTimeout.current);
    }, [query]);

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search TV shows or movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
            />

            {loading && <div className="loading">Loading...</div>}

            {!loading && results.length > 0 && (
                <ul className="search-results">
                    {results.map(({ id, title, year }) => (
                        <li key={id}>
                            {title} [{year}]
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
