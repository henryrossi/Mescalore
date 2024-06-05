import * as React from "react";
import authContext from "../authContext";
import RecipeList from "../components/RecipeList";
import { useLoaderData } from "react-router-dom";
import { RecipePreview } from "../types";
import client from "../client";
import { gql } from "@apollo/client";
import { IconSearch } from "@tabler/icons-react";
import "./Profile.css";

const GET_FAVORITE_RECIPES_QUERY = gql`
  query GetFavoriteRecipesQuery {
    getFavoriteRecipes {
        name
        imageURL
    }
  }
`;

export async function loader() {
    const result = await client.query({
        query: GET_FAVORITE_RECIPES_QUERY,
    });

    if (result.errors) {
        throw Error("Not logged In");
    }

    return result.data.getFavoriteRecipes;
}

export default function Profile() {
    const favorites = useLoaderData() as RecipePreview[];
    const { setUserAuth } = React.useContext(authContext);

    const logoutUser = () => {
        setUserAuth({
            authenticated: false,
            editorPermissions: false,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("editor");
        localStorage.removeItem("tokenTime"); 
    }

    return (
        <div>
            <section className="flex-col gap-1rem main-container__profile">
                <div className="flex">
                    <h1 className="text-2xl flex-1">Welcome to your profile</h1>
                    <button onClick={logoutUser}>
                        Sign Out
                    </button>
                </div>
                <div className="flex">
                    <p className="text-base flex-1">Check out your saved recipes</p>
                    <div className="flex-1 search-controls__profile">
                        <input></input>
                        <button>
                            <IconSearch size={'1rem'}/>
                        </button>
                    </div>
                </div>
            </section>
            <RecipeList recipes={favorites}/>
        </div>
    );
}