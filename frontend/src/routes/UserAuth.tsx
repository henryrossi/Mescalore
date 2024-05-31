import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { USER_REGISTRATION, USER_AUTHENTICATION } from "../graphQL";
import { useMutation } from "@apollo/client";
import "./UserAuth.css";
import authContext from "../authContext";

function setUserAsAuthenticated(token: string, setAuthenticated: (auth: boolean) => void) {
  localStorage.setItem("token", token);
  setAuthenticated(true);

  // stringify the date into a string
  localStorage.setItem("tokenTime", String(Date.now()));

  setTimeout(() => {
    // To be secure I believe I should also remove the Token from the backend database
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTime");
  }, 86400000);
}

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const { setAuthenticated } = React.useContext(authContext);

  const [registerUser] = useMutation(USER_REGISTRATION, {
    onCompleted: (data) => {
      if (data.userRegistration.success) {
        setUserAsAuthenticated(data.userRegistration.token, setAuthenticated);
        navigate("/recipes");
        return;
      }
      window.alert("Failed to register");
      console.log(data.userRegistration.errors);
    },
  });

  return (
    <div className="main-container-user-auth">
      <h1 className="jua text-2xl">Create your account</h1>
      <label>
        Email
        <input  
          type="email"
          className="border-black" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </label>
      <label>
        Username
        <input
          type="text"
          className="border-black" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          className="border-black" 
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
      </label>
      <label>
        Re-enter Password
        <input
          type="password"
          className="border-black" 
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </label>
      <button 
        className="btn btn-blue white text-btn" 
        onClick={() => {
          registerUser({
            variables: {
              email: email,
              username: username,
              password1: password1,
              password2: password2,
            },
          });
        }}
      >
        Register
      </button>
      <p>
        Already have an account? {" "}
        <Link className="blue" to="/sign-in">Sign in</Link>
      </p>
    </div>
  );
}

export function SignIn() {
  const navigate = useNavigate();
  const [usernameEmail, setUsernameEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const { setAuthenticated } = React.useContext(authContext);

  const [authenticateUser] = useMutation(USER_AUTHENTICATION, {
    onCompleted: (data) => {
      if (data.userAuthentication.success) {
        setUserAsAuthenticated(data.userAuthentication.token, setAuthenticated);
        navigate("/recipes");
        return;
      }
      setErrorMessage(data.userAuthentication.errors.nonFieldErrors[0].message);
      setPassword("");
    },
  });

  return (
    <div className="main-container-user-auth">
      <h1 className="jua text-2xl">Login to Mescalore</h1>
      <label>
        Username or Email
        <input 
          type="text"
          className="border-black"
          value={usernameEmail}
          onChange={(e) => setUsernameEmail(e.target.value)} 
        />
      </label>
      <label>
        Password
        <input  
          type="password"
          className="border-black" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      {errorMessage && <p className="red">{errorMessage}</p>}
      <button 
        className="btn btn-blue white text-btn" 
        onClick={() => {
          authenticateUser({
            variables: {
              username: usernameEmail,
              password: password,
            },
          });
        }}
      >
        Login
      </button>
      <p>
        Don't have an account? {" "}
        <Link className="blue" to="/sign-up">Sign up</Link>
      </p>
    </div>
  );
}