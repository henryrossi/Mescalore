import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authContext from "../authContext";
import { IconSearch } from "@tabler/icons-react";
import "./Navbar.css";

function Navbar() {
  const [searchInput, setSearchInput] = React.useState("");
  const navigate = useNavigate();

  const { authenticated, setAuthenticated } = React.useContext(authContext);

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
              return isActive ? "blue" : "black";
            }} to="/"
          >
            home
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) => {
              return isActive ? "blue" : "black";
            }} to="/recipes"
          >
            recipes
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) => {
              return isActive ? "blue" : "black";
            }}
            to="/about"
          >
            about us
          </NavLink>
          {authenticated && 
            <NavLink 
              className={({ isActive, isPending }) => {
                return isActive ? "blue" : "black";
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
          {authenticated ?
            <button 
            className="bg-blue white text-btn"
              onClick={() => setAuthenticated(false)}
            >
              sign out
            </button> 
            :
            <>
              <NavLink 
                className={({ isActive, isPending }) => {
                  return isActive ? "blue" : "black";
                }}
                to="/sign-in"
              >
                sign in
              </NavLink>
              <NavLink 
                className="bg-blue white"
                to="/sign-up"
              >
                sign up
              </NavLink>
            </>
          }
        </div>
      </div>
    </header>
  );
}

export default Navbar;
