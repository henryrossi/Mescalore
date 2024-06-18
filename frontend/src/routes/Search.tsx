import * as React from "react";
import { IconSearch } from "@tabler/icons-react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import "./Search.css";
import client from "../client";
import { gql, useQuery } from "@apollo/client";
import Loading from "../components/Loading";

export const SEARCH_RECIPES_QUERY = gql`
  query SearchRecipesQuery($searchText: String, $offset: Int) {
    searchRecipes(searchText: $searchText, offset: $offset) {
      name
      imageURL
    }
  }
`;

export const GET_NUMBER_OF_RECIPES = gql`
  query NumberOfRecipes {
    getNumberOfRecipes
  }
`;

export async function loader({ request } : { request: Request }) {
  const url = new URL(request.url);
  let searchText = url.searchParams.get("q");
  searchText = searchText ? searchText : "";

  const result = await client.query({
    query: SEARCH_RECIPES_QUERY,
    fetchPolicy: "network-only",
    variables: {
        searchText: searchText,
        offset: 0
    }
  });

  const count = await client.query({
    query: GET_NUMBER_OF_RECIPES,
  });

  return ({
    count: count.data.getNumberOfRecipes,
    searchText: searchText
  });
}

export default function Search() {
  const navigate = useNavigate(); 
  const data = useLoaderData() as { count: string, searchText: string};
  const [searchText, setSearchText] = React.useState<string>(data.searchText);

  const { data: recipes, fetchMore } = useQuery(SEARCH_RECIPES_QUERY, {
    fetchPolicy: "cache-only",
    variables: {
      searchText: data.searchText,
      offset: 0
    }
  })

  const handleSearch = () => {
    if (searchText !== data.searchText) {
      navigate("/search?q=" + searchText);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleFetchMore = () => {
    fetchMore({variables: {
      searchText: data.searchText,
      offset: recipes.searchRecipes.length
    }})
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
            <IconSearch size={'1rem'}/>
          </button>
        </div>
      </section>
      {!recipes ? 
        <Loading /> :
        <>
          <RecipeList recipes={recipes.searchRecipes} />
          {recipes.searchRecipes.length !== 0 && 
          recipes.searchRecipes.length < parseInt(data.count, 10) && (
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
      }
    </>
  );
}
