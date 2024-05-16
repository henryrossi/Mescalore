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
    <>
      <header className="header">
        <nav className="nav">
          <NavLink className={({ isActive, isPending }) => {
              return isActive ? "active" : isPending ? "pending" : "";
            }} to="/"
          >
            home
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) => {
              return isActive ? "active" : isPending ? "pending" : "";
            }} to="/recipes"
          >
            recipes
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) => {
              return isActive ? "active" : isPending ? "pending" : "";
            }}
            to="/about"
          >
            about us
          </NavLink>
          {!localStorage.getItem("token") &&
            <>
              <NavLink 
                className={({ isActive, isPending }) => {
                  return isActive ? "active user-auth" : isPending ? "pending user-auth" : "user-auth";
                }}
                to="/sign-in"
              >
                sign in
              </NavLink>
              <NavLink 
                className={({ isActive, isPending }) => {
                  return isActive ? "active user-auth" : isPending ? "pending user-auth" : "user-auth";
                }} 
                to="/sign-up"
              >
                sign up
              </NavLink>
            </>
          }
          <button onClick={handleNavigateEmpty} className="searchButton">
            <IconSearch size={20} />
          </button>
          <button onClick={handleNavigate} className="searchBarButton">
            <IconSearch size={20} />
          </button>
          <input
            className="searchBar"
            type="text"
            placeholder="Search"
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </nav>
        <hr className="hr" />
      </header>
      <div className="padding" />
    </>
  );
}

export default Navbar;
