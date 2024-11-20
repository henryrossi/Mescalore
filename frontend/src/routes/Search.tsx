import * as React from "react";
import { IconSearch } from "@tabler/icons-react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import "./Search.css";
import client from "../client";
import Loading from "../components/Loading";
import { RecipePreview } from "../types";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  let searchText = url.searchParams.get("q");
  searchText = searchText ? searchText : "";
  let offset = url.searchParams.get("offset");
  offset = offset ? offset : "0";

  const res = await client.get(
    `recipes/search?q=${searchText}&offset=${offset}`,
    "network-only",
  );

  return {
    count: res.data.count,
    searchText: searchText,
    recipes: res.data.recipes,
  };
}

export default function Search() {
  const data = useLoaderData() as {
    count: string;
    searchText: string;
    recipes: RecipePreview[];
  };
  const [_, setSearchParams] = useSearchParams();
  const recipes = data.recipes;
  const [searchText, setSearchText] = React.useState<string>(data.searchText);

  const handleSearch = () => {
    setSearchParams({ q: searchText });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleFetchMore = () => {
    setSearchParams({ q: searchText, offset: String(recipes.length) });
  };

  return (
    <>
      <section className="flex-col gap-1rem search-bar-container__search">
        <h1 className="jua text-4xl">Search for recipes</h1>
        <div>
          <input
            type="text"
            value={searchText}
            placeholder="Search through our recipes here"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>
            <IconSearch size={"1rem"} className="black" />
          </button>
        </div>
      </section>
      {!recipes ? (
        <Loading />
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
  );
}
