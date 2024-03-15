import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { USER_REGISTRATION } from "../graphQL";
import { useMutation } from "@apollo/client";
import "./SignInSignUp.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [registerUser] = useMutation(USER_REGISTRATION, {
    onCompleted: (data) => {
      if (data.userRegistration.success) {
        // store refresh token?
        localStorage.setItem("token", data.userRegistration.token);
        localStorage.setItem("tokenTime", Date.now());
        setTimeout(() => {
          // To be secure I believe I should also remove the Token from the backend database
          localStorage.removeItem("token");
          localStorage.removeItem("tokenTime");
        }, 86400000);
        navigate("/recipes");
        return;
      }
      window.alert("Failed to register");
      console.log(data.userRegistration.errors);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    registerUser({
      variables: {
        email: email,
        username: username,
        password1: password1,
        password2: password2,
      },
    });
  };

  return (
    <div id="fullpage">
      <Navbar />
      <form className="login-register-form" onSubmit={onSubmit}>
        <h1>Create your account</h1>
        <label>
          Email
          <input className="input" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Username
          <input
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            className="input"
            onChange={(e) => setPassword1(e.target.value)}
          />
        </label>
        <label>
          Re-enter Password
          <input
            className="input"
            onChange={(e) => setPassword2(e.target.value)}
          />
        </label>
        <button className="loginButton" type="submit">
          Register
        </button>
        <p>
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
