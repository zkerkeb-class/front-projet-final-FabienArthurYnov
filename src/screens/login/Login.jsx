import React, { useEffect } from "react";
import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router";
import bcrypt from "bcryptjs";
import axios from "axios";


function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const loginToken = sessionStorage.getItem("loginToken");
    const API_url = import.meta.env.VITE_SEENIT_API;

    const handleSubmit = async (e) => {
        e.preventDefault(); // else submitting refresh the page and error message disappear

        const loginData = {
            login: login,
            password: password,
        }

        try {
            const res = await fetch(API_url + "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrorMsg(errorData.message || "Erreur lors de la création de l'utilisateur");
            } else {
                const data = await res.json()
                sessionStorage.setItem("loginToken", data.token);
                navigate("/");
            }
        } catch (error) {
            setErrorMsg("Erreur réseau, veuillez réessayer.");
        }
    }

    useEffect(() => {
        if (loginToken) {
          navigate("/");
        }
    })

    return (
        <>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="logo">SeenIt</h2>
                <h3>Log In</h3>
                <div className="form-group">
                    <label htmlFor="login">Login:</label>
                    <input type="text" id="login" name="login" value={login} onChange={(e) => { setLogin(e.target.value) }} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                <button type="submit" className="login-button">Se connecter</button>
                {errorMsg && <span className="loginError">{errorMsg}</span>}
            <button className="or_signin" onClick={() => navigate("/signin")}>Or Sign in...</button>
            </form>
        </>
    )
}

export default Login;