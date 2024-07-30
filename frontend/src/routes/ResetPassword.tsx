import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { setUserAsAuthenticated } from "./UserAuth";
import authContext from "../authContext";
import "./UserAuth.css";

const PASSWORD_RESET = gql`
  mutation PasswordReset(
    $token: String!
    $newPassword1: String!
    $newPassword2: String!
  ) {
    passwordReset(
      token: $token
      newPassword1: $newPassword1
      newPassword2: $newPassword2
    ) {
      success
      errors
    }
  }
`;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const { setUserAuth } = React.useContext(authContext);

  const [passwordReset] = useMutation(PASSWORD_RESET, {
    onCompleted: (data) => {
      if (data.passwordReset.success) {
        if (!token) return;
        setUserAsAuthenticated(token, false, setUserAuth);
        navigate("/recipes");
        return;
      }
      if (data.passwordReset.errors.nonFieldErrors) {
        setErrorMessage(data.passwordReset.errors.nonFieldErrors[0].message);
        return;
      }
      if (data.passwordReset.errors.newPassword2) {
        setErrorMessage(data.passwordReset.errors.newPassword2[0].message);
        return;
      }
    },
  });

  return (
    <div className="main-container-user-auth">
      <h1 className="jua text-2xl">Reset your password</h1>
      <label>
        New Password
        <input
          type="password"
          className="border-black"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
      </label>
      <label>
        Re-enter New Password
        <input
          type="password"
          className="border-black"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </label>
      {errorMessage && <p className="red">{errorMessage}</p>}
      <button
        className="btn btn-blue white text-btn"
        onClick={() => {
          passwordReset({
            variables: {
              token: token,
              newPassword1: password1,
              newPassword2: password2,
            },
          });
        }}
      >
        Reset
      </button>
    </div>
  );
}
