import React, { useEffect } from "react";
import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router";
import bcrypt from "bcryptjs";
import axios from "axios";


function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [badLogin, setBadLogin] = useState(false);
    const [badPassword, setBadPassword] = useState(false)
    const navigate = useNavigate();
    const loginToken = sessionStorage.getItem("loginToken");

    const API_token = import.meta.env.VITE_APP_TMDB_API_TOKEN;
    console.log(API_token);

    const hashedPassword = async (password) => {
        const saltRounds = 5;
        const hashed = await bcrypt.hash(password, saltRounds);
        return hashed;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // else submitting refresh the page and error message disappear

        const isBadLogin = login.length < 3;
        const isBadPassword = password.length < 8;

        setBadLogin(isBadLogin);
        setBadPassword(isBadPassword);

        if (isBadLogin || isBadPassword) return;

        const hashed = await hashedPassword(password);

        const loginData = {
            login: login,
            password: hashed,
        }

        // initiate session
        try {
            const response = await axios.post("http://localhost:3000/api/login", loginData);
            const loginToken = response.data;

            sessionStorage.setItem("loginToken", JSON.stringify(loginToken));

            navigate("/pokemons");

        } catch (error) {
            console.error("Error during login:", error);
        }
    }

    useEffect(() => {
        if (loginToken) {
          navigate("/pokemons");
        }
    })

    return (
        <>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>SeenIt</h2>
                <div className="form-group">
                    <label htmlFor="login">Login:</label>
                    <input type="text" id="login" name="login" value={login} onChange={(e) => { setLogin(e.target.value) }} />
                    {badLogin && (<span className="loginError">Le login doit faire au moins 3 caractères.</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    {badPassword && (<span className="loginError">Le mot de passe doit faire au moins 8 caractères.</span>)}
                </div>
                <button type="submit" className="login-button">Se connecter</button>
                <span className="debug_info">Faux login, ne pas mettre d'information importantes</span>
            </form>
        </>
    )
}

export default Login;