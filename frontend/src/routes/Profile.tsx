import * as React from "react";
import authContext from "../authContext";
import RecipeList from "../components/RecipeList";
import { useLoaderData, useNavigate } from "react-router-dom";
import { RecipePreview } from "../types";
import client from "../client";
import { gql } from "@apollo/client";
import { IconSearch } from "@tabler/icons-react";
import "./Profile.css";

const GET_FAVORITE_RECIPES_QUERY = gql`
  query GetFavoriteRecipesQuery($searchText: String!) {
    getFavoriteRecipes(searchText: $searchText) {
        name
        imageURL
    }
  }
`;

export async function loader({ request } : {request: Request}) {
    const url = new URL(request.url);
    const searchText = url.searchParams.get("q");
    console.log(searchText);

    const result = await client.query({
        query: GET_FAVORITE_RECIPES_QUERY,
        fetchPolicy: "network-only",
        variables: {
            searchText: searchText ? searchText : "",
        }
    });

    if (result.errors) {
        throw Error("Not logged In");
    }

    return result.data.getFavoriteRecipes;
}

export default function Profile() {
    const favorites = useLoaderData() as RecipePreview[];
    const { userAuth, setUserAuth } = React.useContext(authContext);
    const [seacrhText, setSearchText] = React.useState("");
    const navigate = useNavigate();

    const logoutUser = () => {
        setUserAuth({
            authenticated: false,
            editorPermissions: false,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("editor");
        localStorage.removeItem("tokenTime");
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            navigate("/profile?q=" + seacrhText);
        }
    };

    React.useEffect(() => {
        if (!userAuth.authenticated) {
            navigate("/");
        }
    }, [userAuth.authenticated])

    return (
        <div>
            <section className="flex-col gap-1rem main-container__profile">
                <div className="flex">
                    <h1 className="text-2xl flex-1">Welcome to your profile</h1>
                    <button 
                        className="btn text-btn btn-yellow hover-blue-drop-shadow"
                        onClick={logoutUser}
                    >
                        Sign Out
                    </button>
                </div>
                <div className="flex">
                    <p className="text-base flex-1">Check out your saved recipes</p>
                    <div className="flex-1 search-controls__profile">
                        <input 
                            value={seacrhText} 
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        >
                        </input>
                        <button
                            onClick={() => navigate("/profile?q=" + seacrhText)}
                        >
                            <IconSearch size={'1rem'}/>
                        </button>
                    </div>
                </div>
            </section>
            {favorites.length === 0 ? 
                <div className="flex-col no-favorites__profile">
                    <p className="jua text-xl">
                        Looks like you don't have any favorite recipes :(
                    </p>
                </div> :
                <RecipeList recipes={favorites}/>
            }
        </div>
    );
}