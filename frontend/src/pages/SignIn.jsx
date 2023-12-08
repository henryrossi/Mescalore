import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { USER_AUTHENTICATION } from "../graphQL.js";
import Navbar from "../components/Navbar.jsx";
import "./SignInSignUp.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [usernameEmail, setUsernameEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authenticateUser] = useMutation(USER_AUTHENTICATION, {
    onCompleted: (data) => {
      if (data.userAuthentication.success) {
        // store refresh token?
        localStorage.setItem("token", data.userAuthentication.token);
        // setTimeout(() => {
        //   // To be secure I believe I should also remove the Token from the backend database
        //   localStorage.removeItem("token");
        // }, 1800000);
        navigate("/recipes");
        return;
      }
      window.alert("Failed to login");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    authenticateUser({
      variables: {
        username: usernameEmail,
        password: password,
      },
    });
  };

  return (
    <div id="fullpage">
      <Navbar />
      <form className="login-register-form" onSubmit={onSubmit}>
        <h1>Login to Mescalore</h1>
        <label>
          Username or Email
          <input onChange={(e) => setUsernameEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
