import * as React from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import type { Params } from "react-router-dom";
import { gql, operationName, useMutation } from "@apollo/client";
import { RecipeData, RecipeGraphQLReturn } from "../types";
import { IconHeart, IconEdit } from "@tabler/icons-react";
import authContext from "../authContext";
import "./Recipe.css";
import client from "../client";

const GET_RECIPE_QUERY = gql`
  query recipeQuery($name: String!) {
    getRecipeByName(name: $name) {
      id
      name
      description
      servings
      time
      category {
        name
      }
      imageURL
      ingredientSections {
        name
        ingredientList {
          measurement
          ingredient {
            name
          }
        }
      }
      instructions
      favorite
    }
  }
`;

const GET_RECIPE_QUERY_STRING = `query recipeQuery($name: String!) {
    getRecipeByName(name: $name) {
      id
      name
      description
      servings
      time
      category {
        name
      }
      imageURL
      ingredientSections {
        name
        ingredientList {
          measurement
          ingredient {
            name
          }
        }
      }
      instructions
      favorite
    }
  }`;

const FAVORITE_RECIPE = gql`
  mutation FavoriteRecipeMutation($recipeId: ID!) {
    favoriteRecipe(recipeId: $recipeId) {
      updated
    }
  }
`;

const UNFAVORITE_RECIPE = gql`
  mutation UnfavoriteRecipeMutation($recipeId: ID!) {
    unfavoriteRecipe(recipeId: $recipeId) {
      updated
    }
  }
`;

function decomposeGraphQLData(gqlData: RecipeGraphQLReturn): RecipeData {
  return {
    id: gqlData.id,
    name: gqlData.name,
    description: gqlData.description,
    servings: gqlData.servings,
    time: gqlData.time,
    categories: gqlData.category.map((cat) => cat.name),
    imageURL: gqlData.imageURL,
    ingredientSections: gqlData.ingredientSections.map((section) => ({
      ...section,
      ingredients: section.ingredientList.map((ingr) => ({
        measurement: ingr.measurement,
        ingredient: ingr.ingredient.name,
      })),
    })),
    instructions: gqlData.instructions,
    favorite: gqlData.favorite,
  };
}

export async function loader({
  params,
}: {
  params: Params<"recipeName">;
}): Promise<RecipeData> {
  const url = process.env.BACKEND_URI ? process.env.BACKEND_URI : "";
  const auth = localStorage.getItem("token")
    ? `JWT ${localStorage.getItem("token")}`
    : "";

  const response = await fetch(url, {
    method: "POST",
    headers: { authorization: auth, "content-type": "application/json" },
    body: JSON.stringify({
      query: GET_RECIPE_QUERY_STRING,
      variables: { name: params.recipeName },
    }),
  });

  let url_backend = process.env.BACKEND_URI ? process.env.BACKEND_URI : "";
  url_backend = url_backend.slice(0, 21) + "/recipes/" + params.recipeName;
  const total = await fetch(url_backend, {
    method: "GET",
    headers: { "content-type": "application/json" },
  });
  try {
    const message = await total.json();
    console.log(message);
  } catch (error) {
    console.log(error);
  }

  const result = await client.query({
    query: GET_RECIPE_QUERY,
    fetchPolicy: "no-cache",
    variables: {
      name: params.recipeName,
    },
  });

  if (!response.ok) {
    throw Error("I think this error should be bad request");
  }

  const body = await response.json();

  // check body.error

  // if (result.error) {
  //   console.log(result.error);
  //   throw Error(result.error.message);
  // }

  return decomposeGraphQLData(body.data.getRecipeByName);
}

export default function Recipe() {
  const { recipeName } = useParams();
  const { userAuth } = React.useContext(authContext);
  const data = useLoaderData() as RecipeData;
  const [favorited, setFavorited] = React.useState(data.favorite);

  const [favoriteRecipe] = useMutation(FAVORITE_RECIPE, {
    onCompleted: (data) => {
      if (data.favoriteRecipe.updated) {
        setFavorited(true);
      }
    },
  });

  const [unfavoriteRecipe] = useMutation(UNFAVORITE_RECIPE, {
    onCompleted: (data) => {
      if (data.unfavoriteRecipe.updated) {
        setFavorited(false);
      }
    },
  });

  const handleIngredientLineThrough = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => {
    const li = e.target as HTMLElement;
    if (li.classList.contains("ingredient-line-through__recipe")) {
      li.classList.remove("ingredient-line-through__recipe");
      return;
    }
    li.classList.add("ingredient-line-through__recipe");
  };

  return (
    <div className="main-container__recipe">
      <section className="flex-col gap-1rem">
        <div className="border-black">
          <div className="orange-banner"></div>
          <div className="flex-col gap-1rem padding-1rem">
            <div className="flex">
              <h1 className="text-5xl jua flex-1">{data.name}</h1>
              {userAuth.authenticated && (
                <div className="flex gap-1rem">
                  <button
                    className="no-border bg-white favorite-button__recipe"
                    onClick={
                      favorited
                        ? () =>
                            unfavoriteRecipe({
                              variables: { recipeId: data.id },
                            })
                        : () =>
                            favoriteRecipe({ variables: { recipeId: data.id } })
                    }
                  >
                    <IconHeart
                      size={"2rem"}
                      stroke={1}
                      className={favorited ? "favorited__recipe" : ""}
                    />
                  </button>
                  {userAuth.editorPermissions && (
                    <Link to={"/edit/" + recipeName}>
                      <IconEdit size={"2rem"} stroke={1.5} className="black" />
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-1rem">
              <span className="red">{data.servings} servings</span>
              <span className="red">{data.time} minutes</span>
            </div>
            <ul className="flex gap-1rem flex-wrap">
              {data.categories.map((cat) => (
                <li key={cat}>
                  <div className="btn btn-yellow blue-drop-shadow">
                    {cat.toLowerCase()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {data.imageURL ? (
          <img className="border-black" src={data.imageURL} alt="" />
        ) : (
          <div className="no-image border-black">
            <p className="red">image unavailable</p>
          </div>
        )}
        <p className="text-base">{data.description}</p>
      </section>
      <section className="flex-col gap-1rem">
        <div>
          <h2 className="text-3xl header-2__recipe">Ingredients</h2>
          {data.ingredientSections.map((section) => (
            <div>
              <h3>{section.name}</h3>
              <ul className="flex-col gap-1rem padding-1rem">
                {section.ingredients.map((ingr, index) => (
                  <li
                    key={index}
                    onClick={handleIngredientLineThrough}
                    className="text-base ingredient__recipe"
                  >
                    {ingr.measurement} {ingr.ingredient}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-3xl header-2__recipe">Instructions</h2>
          <ol className="flex-col gap-1rem list-style-numbered padding-1rem ">
            {data.instructions.split("\r").map((instruction) => (
              <li key={instruction} className="text-base">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
