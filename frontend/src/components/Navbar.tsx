import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import "./Navbar.css";

function Navbar({ currentSubsite } : { currentSubsite: string }) {
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
          <Link className={currentSubsite === "home" ? "active" : ""} to="/">
            home
          </Link>
          <Link
            className={currentSubsite === "recipes" ? "active" : ""}
            to="/recipes"
          >
            recipes
          </Link>
          <Link
            className={currentSubsite === "about" ? "active" : ""}
            to="/about"
          >
            about us
          </Link>
          {!localStorage.getItem("token") &&
            <>
              <Link 
                className={currentSubsite === "sign-in" ? "active user-auth" : "user-auth"} 
                to="/sign-in"
              >
                sign in
              </Link>
              <Link 
                className={currentSubsite === "sign-up" ? "active user-auth" : "user-auth"} 
                to="/sign-up"
              >
                sign up
              </Link>
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
