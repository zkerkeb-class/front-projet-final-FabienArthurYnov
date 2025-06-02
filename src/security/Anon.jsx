import React from "react";
import { Navigate } from "react-router-dom";

const AnonRoute = ({ children }) => {
    const token = sessionStorage.getItem("loginToken");
    return token ? <Navigate to="/" /> : children;
};

export default AnonRoute;
