import React, { useEffect } from "react";
import { useState } from "react";
import "./SignIn.css";
import { Navigate } from "react-router";
import { useNavigate } from "react-router";
import bcrypt from "bcryptjs";
import axios from "axios";


function SignIn() {
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [badLogin, setBadLogin] = useState(false);
    const [badPassword, setBadPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        // Simple validation
        setBadLogin(false);
        setBadPassword(false);
        setErrorMsg("");
        setSuccessMsg("");

        if (pseudo.length < 3) {
            setBadLogin(true);
            return;
        }
        if (password.length < 8) {
            setBadPassword(true);
            return;
        }
        if (!email.includes("@")) {
            setErrorMsg("Email invalide.");
            return;
        }

        setLoading(true);

        // Prepare the user data
        const userData = {
            pseudo,
            email,
            password,
        };

        try {
            const res = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrorMsg(errorData.message || "Erreur lors de la création de l'utilisateur");
            } else {
                setSuccessMsg("Utilisateur créé avec succès !");
                // Reset form
                setPseudo("");
                setEmail("");
                setPassword("");
                navigate("/login");
            }
        } catch (error) {
            setErrorMsg("Erreur réseau, veuillez réessayer.");
        }

        setLoading(false);
    }


    return (
        <>
          <form className="signin-form" onSubmit={handleSubmit}>
            <h2>SeenIt</h2>
            <h3>Sign In</h3>
    
            <div className="form-group">
              <label htmlFor="pseudo">Name:</label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
              />
              {badLogin && <span className="signinError">Le pseudo doit faire au moins 3 caractères.</span>}
            </div>
    
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorMsg && <span className="signinError">{errorMsg}</span>}
            </div>
    
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {badPassword && <span className="signinError">Le mot de passe doit faire au moins 8 caractères.</span>}
            </div>
    
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Chargement..." : "Creer un compte"}
            </button>
    
            {successMsg && <p className="successMsg">{successMsg}</p>}

            <button className="or_login" onClick={navigate("/login")}>Or Log in...</button>
          </form>
        </>
      );
    
}

export default SignIn;