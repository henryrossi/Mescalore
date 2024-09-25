import * as React from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { IconSearch, IconMenu2 } from "@tabler/icons-react";
import authContext from "../authContext";
import "./Navbar.css";

export default function Navbar() {
  const [searchInput, setSearchInput] = React.useState("");
  const [dropDownVisible, setDropDownVisible] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { userAuth, setUserAuth } = React.useContext(authContext);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNavSearch();
    }
  };

  const resetDropDown = () => {
    setDropDownVisible(false);
  };

  const handleNavSearch = () => {
    resetDropDown();
    navigate("/search?q=" + searchInput);
  };

  const logoutUser = () => {
    resetDropDown();
    setUserAuth({
      authenticated: false,
      editorPermissions: false,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("editor");
    localStorage.removeItem("tokenTime");
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
            onClick={resetDropDown}
          >
            home
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }}
            to="/recipes"
            onClick={resetDropDown}
          >
            recipes
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "blue link__navbar" : "black link__navbar";
            }}
            to="/about"
            onClick={resetDropDown}
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

        <button
          onClick={() => {
            setDropDownVisible(!dropDownVisible);
          }}
        >
          {/* Alexa had a good idea to use an actual hamburger for the hamburger menu icon */}
          <IconMenu2 size={"1.2rem"} />
        </button>
        <nav
          className="drop-down__navbar"
          style={{ display: dropDownVisible ? "flex" : "none" }}
        >
          {userAuth.authenticated ? (
            <>
              <Link onClick={resetDropDown} to="/profile" className="black">
                profile
              </Link>
              <Link onClick={logoutUser} to="/profile" className="black">
                sign out
              </Link>
            </>
          ) : (
            <div className="flex gap-1rem user-auth__navbar">
              <Link
                className="bg-blue white sign-up__navbar"
                to="/sign-up"
                onClick={resetDropDown}
              >
                sign up
              </Link>
              <Link to="/sign-in" onClick={resetDropDown} className="black">
                sign in
              </Link>
            </div>
          )}
          <div className="drop-down-break__navbar"></div>
          <Link to="/search" onClick={resetDropDown} className="black">
            search for recipes
          </Link>
          {userAuth.authenticated && userAuth.editorPermissions && (
            <>
              <Link to="/create" onClick={resetDropDown} className="black">
                create a new recipe
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
