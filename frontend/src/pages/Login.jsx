import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { USER_AUTHENTICATION } from "../graphQL.js";
import Navbar from "../components/Navbar";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [authenticateUser] = useMutation(USER_AUTHENTICATION, {
    onCompleted: (data) => {
      if (data.userAuthentication.success) {
        // store refresh token?
        localStorage.setItem("token", data.userAuthentication.token);
        setTimeout(() => {
          // To be secure I believe I should also remove the Token from the backend database
          localStorage.removeItem("token");
        }, 1800000);
        navigate("/recipes");
        return;
      }
      window.alert("Failed to login");
    },
  });

  return (
    <div id="fullpage">
      <Navbar />
      <main className="login">
        <input
          className="input"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="loginButton"
          onClick={() =>
            authenticateUser({
              variables: {
                username: username,
                password: password,
              },
            })
          }
        >
          Login
        </button>
      </main>
    </div>
  );
}
