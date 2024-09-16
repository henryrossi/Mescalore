import * as React from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  IconSearch,
  IconUserCircle,
  IconBaselineDensityMedium,
} from "@tabler/icons-react";
import authContext from "../authContext";
import "./Navbar.css";

export default function Navbar() {
  const [searchInput, setSearchInput] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { userAuth } = React.useContext(authContext);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNavSearch();
    }
  };

  const handleNavSearch = () => {
    navigate("/search?q=" + searchInput);
  };

  return (
    <header className="bg-white header__navbar">
      <div className="header-container__navbar">
        <nav className="links__navbar">
          <NavLink
            className={({ isActive }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }}
            to="/"
          >
            home
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }}
            to="/recipes"
          >
            recipes
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }}
            to="/about"
          >
            about us
          </NavLink>
        </nav>
        {location.pathname !== "/search" && (
          <div className="search-container__navbar">
            <input
              type="text"
              placeholder="Search"
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleNavSearch}>
              <IconSearch size={"1rem"} />
            </button>
          </div>
        )}

        <button>
          <IconBaselineDensityMedium size={"1.6rem"} />
        </button>
        <div className="drop-down__navbar">
          {userAuth.authenticated ? (
            <Link className="" to="/profile">
              profile
            </Link>
          ) : (
            <>
              <Link className="black link__navbar" to="/sign-in">
                sign in
              </Link>
              <Link className="bg-blue white link__navbar" to="/sign-up">
                sign up
              </Link>
            </>
          )}
          {userAuth.authenticated && userAuth.editorPermissions && (
            <>
              <br />
              <Link to="/create">create</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
