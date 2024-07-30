import * as React from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./UserAuth.css";

const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation sendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success
      errors
    }
  }
`;

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const [sendResetEmail] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
    onCompleted: (data) => {
      if (data.sendPasswordResetEmail.success) {
        navigate("/password-reset-email-sent");
        return;
      }
      if (data.sendPasswordResetEmail.errors.email) {
        setErrorMessage(data.sendPasswordResetEmail.errors.email[0].message);
        return;
      }
      if (data.sendPasswordResetEmail.errors.nonFieldErrors) {
        setErrorMessage(
          data.sendPasswordResetEmail.errors.nonFieldErrors[0].message,
        );
        return;
      }
    },
  });

  return (
    <div className="main-container-user-auth">
      <h1 className="jua text-2xl">Forgot Your Password?</h1>
      <label>
        Enter your email
        <input
          type="text"
          className="border-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {errorMessage && <p className="red">{errorMessage}</p>}
      <button
        className="btn btn-blue white text-btn"
        onClick={() => {
          sendResetEmail({
            variables: {
              email: email,
            },
          });
        }}
      >
        Send
      </button>
    </div>
  );
}

export function PasswordResetEmailSent() {
  return (
    <div className="main-container-user-auth">
      <h1 className="jua text-2xl">
        A link to reset your password has been sent to your email.
      </h1>
      <Link to="/" className="blue">
        Return home
      </Link>
    </div>
  );
}
