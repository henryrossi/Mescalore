import * as React from "react";
import authContext from "../authContext";
import RecipeList from "../components/RecipeList";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { RecipePreview } from "../types";
import client from "../client";
import { IconSearch } from "@tabler/icons-react";
import "./Profile.css";
import Loading from "../components/Loading";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  let searchText = url.searchParams.get("q");
  searchText = searchText ? searchText : "";
  let offset = url.searchParams.get("offset");
  offset = offset ? offset : "0";

  const result = await client.get(
    `recipes/favorites?q=${searchText}&offset=${offset}`,
    "network-only",
  );

  if (result.status) throw Error("Unauthorized!");

  return {
    urlSearch: searchText,
    recipes: result.data.recipes,
    count: result.data.count,
  };
}

export default function Profile() {
  const data = useLoaderData() as {
    urlSearch: string;
    count: string;
    recipes: RecipePreview[];
  };
  const { userAuth } = React.useContext(authContext);
  const [_, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = React.useState(data.urlSearch);
  const navigate = useNavigate();
  const recipes = data.recipes;

  const handleSearch = () => {
    setSearchParams({ q: searchText });
  };

  const handleFetchMore = () => {
    setSearchParams({ q: searchText, offset: String(recipes.length) });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
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
        </div>
        <div className="grid">
          <p className="text-base flex-1">Check out your saved recipes</p>
          <div className="flex-1 search-controls__profile">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
            ></input>
            <button onClick={handleSearch}>
              <IconSearch size={"1rem"} className="black" />
            </button>
          </div>
        </div>
      </section>
      {!recipes ? (
        <Loading />
      ) : (
        <>
          {recipes.length === 0 ? (
            <div className="flex-col no-favorites__profile">
              <p className="jua text-xl">
                Looks like you don't have any favorite recipes :(
              </p>
            </div>
          ) : (
            <>
              <RecipeList recipes={recipes} />
              {recipes.length !== 0 &&
                recipes.length < parseInt(data.count, 10) && (
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
