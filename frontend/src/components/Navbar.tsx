import * as React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import authContext from "../authContext";
import { IconSearch, IconUserCircle } from "@tabler/icons-react";
import "./Navbar.css";

function Navbar() {
  const [searchInput, setSearchInput] = React.useState("");
  const navigate = useNavigate();

  const { userAuth, setUserAuth } = React.useContext(authContext);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNavigate();
    }
  };

  const handleNavigate = () => {
    navigate("/search", { replace: true, state: { search: searchInput } });
  };

  return (
    <header className="bg-white header-navbar">
      <div className="header-container-navbar">
        <nav className="links-navbar">
          <NavLink className={({ isActive, isPending }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }} to="/"
          >
            home
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }} to="/recipes"
          >
            recipes
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }}
            to="/about"
          >
            about us
          </NavLink>
          {userAuth.authenticated && userAuth.editorPermissions &&
            <NavLink 
              className={({ isActive, isPending }) => {
                return isActive ? "blue link__navbar" : "black link__navbar";
              }}
              to="/create"
            >
              create
            </NavLink>
          }
        </nav>
        <div className="search-container-navbar">
          <input
            type="text"
            placeholder="Search"
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleNavigate}>
            <IconSearch size={'1rem'}/>
          </button>
        </div>

        <div className="user-auth-navbar">
          {userAuth.authenticated ?
            <Link
              className="bg-white black profile-pic__navbar"
              to="/profile"
            >
              <IconUserCircle size={'1.6rem'}/>
            </Link> 
            :
            <>
              <Link
                className="black link__navbar"
                to="/sign-in"
              >
                sign in
              </Link>
              <Link 
                className="bg-blue white link__navbar"
                to="/sign-up"
              >
                sign up
              </Link>
            </>
          }
        </div>
      </div>
    </header>
  );
}

export default Navbar;
