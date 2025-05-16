import React from "react";
import { useNavigate } from "react-router";
import { useEffect } from 'react';

function Logout() {
    const navigate = useNavigate();
    
    useEffect( () => {
        sessionStorage.removeItem("loginToken");
        navigate("/");
    }, [])

    return (
        <>
            <span>Login out...</span>
        </>
    )
}

export default Logout;