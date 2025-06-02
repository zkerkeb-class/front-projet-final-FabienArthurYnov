import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_url = import.meta.env.VITE_SEENIT_API;

const ProtectedRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null); // null = loading, true/false = result
    const token = sessionStorage.getItem("loginToken");

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsValid(false);
                return;
            }

            try {
                const res = await fetch(API_url + "/api/verify", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    setIsValid(true);
                    return;
                } else {
                    sessionStorage.removeItem("loginToken");
                    setIsValid(false);
                    return;
                }
            } catch (err) {       
                console.log("Token verification failed : ", err);
                sessionStorage.removeItem("loginToken");
                setIsValid(false);
            }
        };

        verifyToken();
    }, []);

    if (isValid === null) return <p>Chargement...</p>; // Optional loading screen
    return isValid ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
