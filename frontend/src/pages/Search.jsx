import { React, useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@apollo/client";
import { SEARCH_RECIPES_QUERY, GET_NUMBER_OF_RECIPES } from "../graphQL.js";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import RecipeList from "../components/RecipeList";
import Footer from "../components/Footer";
import "./Search.css";

export default function Search() {
  const location = useLocation();
  // location.state is not set when search page is accessed maually
  let search = "";
  if (location.state !== null) {
    search = location.state.search;
  }

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(search);
  const [lastSearch, setLastSearch] = useState(search);
  const [timesFetched, setTimesFetched] = useState(1);
  const limit = 12;

  useEffect(() => {
    // Updates state when navbar search is used on search page
    setSearchText(search);
    setLastSearch(search);
    setTimesFetched(1);
  }, [search]);

  /* Queries */

  const { loading, error, data, refetch, fetchMore } = useQuery(
    SEARCH_RECIPES_QUERY,
    {
      variables: {
        searchText: search,
        offset: 0,
        limit: limit,
      },
    }
  );

  const {
    loading: loadingCount,
    error: errorCount,
    data: count,
  } = useQuery(GET_NUMBER_OF_RECIPES);

  // Handles users clicking the fetch more button more times
  // than the query is executed
  if (data) {
    if (timesFetched !== Math.ceil(data.searchRecipes.length / limit))
      setTimesFetched(Math.ceil(data.searchRecipes.length / limit));
  }

  const handleRefetch = () => {
    if (searchText !== lastSearch) {
      refetch({
        searchText: searchText,
      });
      navigate("/search", { replace: true, state: { search: searchText } });
      setLastSearch(searchText);
      setTimesFetched(1);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleRefetch();
    }
  };

  const handleFetchMore = () => {
    if (loadingCount) return;
    if (limit * timesFetched >= count.getNumberOfRecipes) return;
    fetchMore({
      variables: {
        searchText: lastSearch,
        offset: limit * timesFetched,
      },
    });
    setTimesFetched(timesFetched + 1);
  };

  /* Page rendering */

  if (error) console.log(error.message);
  if (errorCount) console.log(errorCount.message);

  return (
    <div id="fullpage">
      <Navbar currentSubsite={"recipes"} />
      <input
        className="searchInput"
        type="text"
        value={searchText}
        placeholder="Search through our recipes here"
        onChange={(event) => setSearchText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="searchInputButton" onClick={handleRefetch}>
        <IconSearch className="searchIcon" />
      </button>
      {loading || loadingCount ? (
        <Loading />
      ) : (
        <RecipeList recipes={data.searchRecipes} />
      )}
      {data && data.searchRecipes.length === 0 ? (
        <div className="searchPadding" />
      ) : (
        count &&
        limit * timesFetched < count.getNumberOfRecipes && (
          <button className="fetchMore" onClick={handleFetchMore}>
            Load more recipes
          </button>
        )
      )}
      <Footer />
    </div>
  );
}
