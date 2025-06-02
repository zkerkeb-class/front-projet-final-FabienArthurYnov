import React from "react";
import "./ShowCard.css"; // Assuming CSS is in Card.css

const ShowCard = ({
  poster = "https://via.placeholder.com/150x225?text=Poster",
  name = "Show Name",
  year = "2025",
  season = "S1",
  episode = "E1",
  onClick,
}) => {
  return (
    <div
      className="card"
      style={{ backgroundImage: `url(${poster})` }}
      onClick={onClick}
    >
      <div className="card-info-top">
        <h4 className="card-name">{name}</h4>
        <span className="card-year">{year}</span>
      </div>
      <div className="card-info-bottom">
        <span className="card-episode">{episode}</span> |{" "}
        <span className="card-season">{season}</span>
      </div>
    </div>
  );
};

export default ShowCard;
