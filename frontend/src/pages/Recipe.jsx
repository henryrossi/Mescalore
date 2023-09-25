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
  };

  return (
    <div id="fullpage">
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <article className="recipe">
          <h1>{data.getRecipeByName.name}</h1>
          {localStorage.getItem("token") && (
            <Link to={"/edit/" + recipeName}>Edit</Link>
          )}
          <section className="info">
            <p className="servingsAndTime">
              {data.getRecipeByName.servings} servings |{"  "}
              {data.getRecipeByName.time} minutes
            </p>
            <h2>{data.getRecipeByName.description}</h2>
            <ul>
              {data.getRecipeByName.category.map((tag) => (
                <li className="tag" key={tag.name}>
                  {tag.name.toLowerCase()}
                </li>
              ))}
            </ul>
            {data.getRecipeByName.base64picture ? (
              <img
                className="photo"
                src={
                  "data:image/jpeg;charset=utf-8;base64," +
                  atob(data.getRecipeByName.base64picture)
                }
                alt=""
              />
            ) : (
              <div className="noPicture">
                <p className="message">image unavailable</p>
              </div>
            )}
          </section>
          <div className="ingredients">
            <p>Ingredients</p>
            <ul>
              {data.getRecipeByName.ingredientList.map((obj, index) => (
                <li className="ingredient" key={index}>
                  {obj.measurement} {obj.ingredient.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="instructions">
            <p>Instructions</p>
            <ul>
              {data.getRecipeByName.instructions
                .split("\r")
                .map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
            </ul>
          </div>
        </article>
      )}
      <Footer />
    </div>
  );
}

export default Recipe;
