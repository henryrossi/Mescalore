import * as React from "react";
import authContext from "../authContext";
import RecipeList from "../components/RecipeList";
import { useLoaderData, useNavigate } from "react-router-dom";
import { RecipePreview } from "../types";
import client from "../client";
import { gql, useQuery } from "@apollo/client";
import { IconSearch } from "@tabler/icons-react";
import "./Profile.css";
import Loading from "../components/Loading";

const GET_FAVORITE_RECIPES_QUERY = gql`
  query GetFavoriteRecipesQuery($searchText: String!, $offset: Int) {
    getFavoriteRecipes(searchText: $searchText, offset: $offset) {
      name
      imageURL
    }
  }
`;

const GET_NUMBER_OF_FAVORITES_QUERY = gql`
  query GetNumberOfFavoritesQuery {
    getNumberOfFavorites
  }
`;

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  let searchText = url.searchParams.get("q");
  searchText = searchText ? searchText : "";

  const result = await client.query({
    query: GET_FAVORITE_RECIPES_QUERY,
    fetchPolicy: "network-only",
    variables: {
      searchText: searchText,
      offset: 0,
    },
  });

  const count = await client.query({
    query: GET_NUMBER_OF_FAVORITES_QUERY,
  });

  if (result.errors) {
    throw Error("Not logged In");
  }

  return {
    urlSearch: searchText,
    count: count.data.getNumberOfFavorites,
  };
}

export default function Profile() {
  const data = useLoaderData() as { urlSearch: string; count: string };
  const { userAuth, setUserAuth } = React.useContext(authContext);
  const [seacrhText, setSearchText] = React.useState(data.urlSearch);
  const navigate = useNavigate();

  const { data: recipes, fetchMore } = useQuery(GET_FAVORITE_RECIPES_QUERY, {
    fetchPolicy: "cache-only",
    variables: {
      searchText: data.urlSearch,
      offset: 0,
    },
  });

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        searchText: data.urlSearch,
        offset: recipes.getFavoriteRecipes.length,
      },
    });
  };

  const logoutUser = () => {
    setUserAuth({
      authenticated: false,
      editorPermissions: false,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("editor");
    localStorage.removeItem("tokenTime");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate("/profile?q=" + seacrhText);
    }
  };

  React.useEffect(() => {
    if (!userAuth.authenticated) {
      navigate("/");
    }
  }, [userAuth.authenticated]);

  return (
    <div>
      <section className="flex-col gap-1rem main-container__profile">
        <div className="flex flex-wrap">
          <h1 className="text-2xl flex-1">Welcome to your profile</h1>
          <button
            className="btn text-btn btn-yellow hover-blue-drop-shadow 
                                   sign-out-button__profile"
            onClick={logoutUser}
          >
            Sign Out
          </button>
        </div>
        <div className="grid">
          <p className="text-base flex-1">Check out your saved recipes</p>
          <div className="flex-1 search-controls__profile">
            <input
              value={seacrhText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
            ></input>
            <button onClick={() => navigate("/profile?q=" + seacrhText)}>
              <IconSearch size={"1rem"} />
            </button>
          </div>
        </div>
      </section>
      {!recipes ? (
        <Loading />
      ) : (
        <>
          {recipes.getFavoriteRecipes.length === 0 ? (
            <div className="flex-col no-favorites__profile">
              <p className="jua text-xl">
                Looks like you don't have any favorite recipes :(
              </p>
            </div>
          ) : (
            <>
              <RecipeList recipes={recipes.getFavoriteRecipes} />
              {recipes.getFavoriteRecipes.length !== 0 &&
                recipes.getFavoriteRecipes.length <
                  parseInt(data.count, 10) && (
                  <div className="flex refetch-btn-container__search">
                    <button
                      className="btn text-btn btn-yellow blue-drop-shadow"
                      onClick={handleFetchMore}
                    >
                      Load more recipes
                    </button>
                  </div>
                )}
            </>
          )}
        </>
      )}
    </div>
  );
}
