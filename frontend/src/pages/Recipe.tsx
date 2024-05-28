import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { ApolloError, useQuery } from "@apollo/client";
import { GET_RECIPE_QUERY } from "../graphQL";
import { RecipeData } from "../types";
import { IconEdit } from "@tabler/icons-react";
import authContext from "../authContext";
import Loading from "../components/Loading";
import "./Recipe.css";
import Unavailable from "../components/Unavailable";

export default function Recipe() {
  const { recipeName } = useParams();
  const { authenticated } = React.useContext(authContext);

  const handleIngredientLineThrough = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const li = e.target as HTMLElement;
    if (li.classList.contains("ingredient-line-through__recipe")) {
      li.classList.remove("ingredient-line-through__recipe");
      return;
    }
    li.classList.add("ingredient-line-through__recipe");
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
        <div className="main-container__recipe">
          <section className="flex-col gap-1rem"> 
            <div className="border-black">
              <div className="bg-orange text-base info_title__recipe">RECIPE INFO</div>
              <div className="flex-col gap-1rem padding-1rem">
                <div className="flex">
                  <h1 className="text-5xl jua flex-1">{data.getRecipeByName.name}</h1>
                  {authenticated && (
                    <Link to={"/edit/" + recipeName}>
                      <IconEdit />
                    </Link>
                  )}
                </div>
                <div className="flex gap-1rem">
                  <span className="red">{data.getRecipeByName.servings} servings</span>
                  <span className="red">{data.getRecipeByName.time} minutes</span>
                </div>
                <ul className="flex gap-1rem flex-wrap">
                  {data.getRecipeByName.category.map((tag) => (
                    <li key={tag.name}>
                      <div className="btn btn-yellow blue-drop-shadow">{tag.name.toLowerCase()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {data.getRecipeByName.imageURL ? 
              <img 
                className="border-black"
                src={data.getRecipeByName.imageURL} 
                alt="" 
              /> : 
              <div className="no-image border-black">
                <p className="red">image unavailable</p>
              </div>
            }
            <p>{data.getRecipeByName.description}</p>
          </section>
          <section className="flex-col gap-1rem">
            <div>
              <h2 className="text-3xl header-2__recipe">Ingredients</h2>
              <ul className="flex-col gap-1rem padding-1rem">
                {data.getRecipeByName.ingredientList.map((obj, index) => (
                  <li 
                    key={index} 
                    onClick={handleIngredientLineThrough}
                    className="ingredient__recipe"
                  >
                    {obj.measurement} {obj.ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl header-2__recipe">Instructions</h2>
              <ol className="flex-col gap-1rem list-style-numbered padding-1rem ">
                {data.getRecipeByName.instructions
                  .split("\r")
                  .map((instruction) => (
                    <li key={instruction} className="">{instruction}</li>
                  ))}
              </ol>
            </div>
          </section>
        </div>
      )}
    </>
  );
}