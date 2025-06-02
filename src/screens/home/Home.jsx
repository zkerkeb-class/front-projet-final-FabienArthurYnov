import React from "react";
import { useNavigate } from "react-router";
import { useEffect } from 'react';

function Home() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("loginToken");

    

    return (
        <>
            <span>Home WIP</span>
        </>
    )
}

export default Home;