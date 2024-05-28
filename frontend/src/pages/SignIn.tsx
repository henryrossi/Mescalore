import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { USER_AUTHENTICATION } from "../graphQL";
import "./UserAuth.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [usernameEmail, setUsernameEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [authenticateUser] = useMutation(USER_AUTHENTICATION, {
    onCompleted: (data) => {
      if (data.userAuthentication.success) {
        // store refresh token?
        localStorage.setItem("token", data.userAuthentication.token);
        localStorage.setItem("tokenTime", String(Date.now()));
        setTimeout(() => {
          // To be secure I believe I should also remove the Token from the backend database
          localStorage.removeItem("token");
          localStorage.removeItem("tokenTime");
        }, 86400000);
        navigate("/recipes");
        return;
      }
      window.alert("Failed to login");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authenticateUser({
      variables: {
        username: usernameEmail,
        password: password,
      },
    });
  };

  return (
    <form className="main-container-user-auth" onSubmit={onSubmit}>
      <h1 className="jua text-2xl">Login to Mescalore</h1>
      <label>
        Username or Email
        <input 
          className="border-black" 
          onChange={(e) => setUsernameEmail(e.target.value)} 
        />
      </label>
      <label>
        Password
        <input  
          className="border-black" 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      <button 
        className="btn btn-blue white text-btn" 
        type="submit"
      >
        Login
      </button>
      <p>
        Don't have an account? {" "}
        <Link className="blue" to="/sign-up">Sign up</Link>
      </p>
    </form>
  );
}
