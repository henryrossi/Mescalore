import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { ApolloError, useQuery } from "@apollo/client";
import { GET_RECIPE_QUERY } from "../graphQL";
import { RecipeData } from "../types";
import { IconEdit } from "@tabler/icons-react";
import Loading from "../components/Loading";
import "./Recipe.css";
import Unavailable from "../components/Unavailable";

export default function Recipe() {
  const { recipeName } = useParams();

  const handleIngredientLineThrough = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const li = e.target as HTMLElement;
    if (li.classList.length === 0) {
      li.classList.add("line-through");
      return;
    }
    li.classList.remove("line-through");
  };

  const { loading, error, data } : 
        { loading: boolean, 
          error?: ApolloError | undefined, 
          data: { getRecipeByName : RecipeData } | undefined 
        } = 
  useQuery(GET_RECIPE_QUERY, {
    variables: {
      name: recipeName,
    },
  });

  if (error) {
    return <Unavailable />;
  }
  
  return (
    <>
      {loading || data === undefined ? (
        <Loading />
      ) : (
        <>
          <div className="page-container-recipe"> 
            <div className="info-container-recipe">
              <h1 className="text-5xl jua">{data.getRecipeByName.name}</h1>
              {localStorage.getItem("token") && (
                <Link to={"/edit/" + recipeName} className="edit-link">
                  <IconEdit />
                </Link>
              )}
              <div>{data.getRecipeByName.servings} servings</div>
              <div>{data.getRecipeByName.time} minutes</div>
            </div>
            <ul className="category-container-recipe">
              {data.getRecipeByName.category.map((tag) => (
                <li key={tag.name}>
                  <div className="bg-red white">{tag.name.toLowerCase()}</div>
                </li>
              ))}
            </ul>
            {data.getRecipeByName.imageURL ? 
              <img src={data.getRecipeByName.imageURL} alt="" /> : 
              <div>
                <p>image unavailable</p>
              </div>
            }
            <p>{data.getRecipeByName.description}</p>
          </div>
          <div className="bg-red bottom-background-recipe">
            <div className="bottom-container-recipe">
              <div>
                <h2 className="text-3xl yellow">Ingredients</h2>
                <ul>
                  {data.getRecipeByName.ingredientList.map((obj, index) => (
                    <li key={index} onClick={handleIngredientLineThrough} className="white">
                      {obj.measurement} {obj.ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-3xl yellow">Instructions</h2>
                <ol>
                  {data.getRecipeByName.instructions
                    .split("\r")
                    .map((instruction) => (
                      <li key={instruction} className="white instructions-recipe">{instruction}</li>
                    ))}
                </ol>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}