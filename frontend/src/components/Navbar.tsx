import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import "./Navbar.css";

function Navbar() {
  const [searchInput, setSearchInput] = React.useState("");
  const navigate = useNavigate();

  const handleNavigateEmpty = () => {
    navigate("/search", { state: { search: "" } });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNavigate();
    }
  };

  const handleNavigate = () => {
    navigate("/search", { replace: true, state: { search: searchInput } });
  };

  return (
    <header className="bg-white header">
      <div className="header-container">
        <nav className="navbar">
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
        </nav>

        <input
          className="searchBar"
          type="text"
          placeholder="Search"
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleNavigate} className="header-search-bar-button">
          <IconSearch size={'1rem'}/>
        </button>

        {!localStorage.getItem("token") &&
          <div className="user-auth">
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
          </div>
        }
      </div>
    </header>
  );
}

export default Navbar;
