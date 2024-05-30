import * as React from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import type { Params } from "react-router-dom";
import { gql } from "@apollo/client";
import { RecipeData } from "../types";
import { IconEdit } from "@tabler/icons-react";
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
      ingredientList {
        ingredient {
          name
        }
        measurement
      }
      instructions
    }
  }
`;

export async function loader({ params }: { params: Params<"recipeName">}) {
  const result = await client.query({
    query: GET_RECIPE_QUERY,
    variables: {
      name: params.recipeName,
    },
  });

  return result.data.getRecipeByName;
}

export default function Recipe() {
  const { recipeName } = useParams();
  const { authenticated } = React.useContext(authContext);
  const data = useLoaderData() as RecipeData;

  const handleIngredientLineThrough = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
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
              {authenticated && (
                <Link to={"/edit/" + recipeName}>
                  <IconEdit />
                </Link>
              )}
            </div>
            <div className="flex gap-1rem">
              <span className="red">{data.servings} servings</span>
              <span className="red">{data.time} minutes</span>
            </div>
            <ul className="flex gap-1rem flex-wrap">
              {data.category.map((tag) => (
                <li key={tag.name}>
                  <div className="btn btn-yellow blue-drop-shadow">{tag.name.toLowerCase()}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {data.imageURL ? 
          <img 
            className="border-black"
            src={data.imageURL} 
            alt="" 
          /> : 
          <div className="no-image border-black">
            <p className="red">image unavailable</p>
          </div>
        }
        <p className="text-base">{data.description}</p>
      </section>
      <section className="flex-col gap-1rem">
        <div>
          <h2 className="text-3xl header-2__recipe">Ingredients</h2>
          <ul className="flex-col gap-1rem padding-1rem">
            {data.ingredientList.map((obj, index) => (
              <li 
                key={index} 
                onClick={handleIngredientLineThrough}
                className="text-base ingredient__recipe"
              >
                {obj.measurement} {obj.ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl header-2__recipe">Instructions</h2>
          <ol className="flex-col gap-1rem list-style-numbered padding-1rem ">
            {data.instructions
              .split("\r")
              .map((instruction) => (
                <li key={instruction} className="text-base">{instruction}</li>
              ))}
          </ol>
        </div>
      </section>
    </div>
  );
}