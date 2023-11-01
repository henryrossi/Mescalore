import { React } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RECIPE_QUERY } from "../graphQL.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import "./Recipe.css";

function Recipe() {
  const { recipeName } = useParams();

  const { loading, error, data } = useQuery(GET_RECIPE_QUERY, {
    variables: {
      name: recipeName,
    },
  });

  if (error) {
    console.log(error.message);
    return "recipe not found";
  }

  return (
    <div id="fullpage">
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        //   {localStorage.getItem("token") && (
        //     <Link to={"/edit/" + recipeName}>Edit</Link>
        //   )}
        <>
          <div className="recipeInfo">
            <h1>{data.getRecipeByName.name}</h1>
            <span>{data.getRecipeByName.servings} servings</span>
            <span>{data.getRecipeByName.time} minutes</span>
            {data.getRecipeByName.category.map((tag) => (
              <span key={tag.name}>{tag.name.toLowerCase()}</span>
            ))}
            <p>{data.getRecipeByName.description}</p>
            {/* <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p> */}
            {data.getRecipeByName.base64picture ? (
              <img
                src={
                  "data:image/jpeg;charset=utf-8;base64," +
                  atob(data.getRecipeByName.base64picture)
                }
                alt=""
              />
            ) : (
              <div className="noPicture"></div>
            )}
          </div>
          <div className="recipeBackground">
            <div className="ingredients">
              <h2>Ingredients</h2>
              <ul>
                {data.getRecipeByName.ingredientList.map((obj, index) => (
                  <li key={index}>
                    {obj.measurement} {obj.ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="instructions">
              <h2>Instructions</h2>
              <ol>
                {data.getRecipeByName.instructions
                  .split("\r")
                  .map((instruction) => (
                    <li key={instruction}>{instruction}</li>
                  ))}
              </ol>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}

export default Recipe;
