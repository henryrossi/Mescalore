import { React } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RECIPE_QUERY } from "../graphQL.js";
import { IconEdit } from "@tabler/icons-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import "./Recipe.css";
import Unavailable from "../components/Unavailable.jsx";

function Recipe() {
  const { recipeName } = useParams();

  const handleIngredientLineThrough = (e) => {
    const li = e.target;
    if (li.classList.length === 0) {
      li.classList.add("line-through");
      return;
    }
    li.classList.remove(...li.classList);
  };

  const { loading, error, data } = useQuery(GET_RECIPE_QUERY, {
    variables: {
      name: recipeName,
    },
  });

  if (error) {
    // console.log(error.message);
    return <Unavailable />;
  }

  return (
    <div id="fullpage">
      <Navbar currentSubsite={"recipes"} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="recipe-info">
            <h1>{data.getRecipeByName.name}</h1>
            {localStorage.getItem("token") && (
              <Link to={"/edit/" + recipeName} className="edit-link">
                <IconEdit />
              </Link>
            )}
            <ul>
              <li key="servings">
                <span>{data.getRecipeByName.servings} servings</span>
              </li>
              <li key="time">
                <span>{data.getRecipeByName.time} minutes</span>
              </li>
              {data.getRecipeByName.category.map((tag) => (
                <li key={tag.name}>
                  <span>{tag.name.toLowerCase()}</span>
                </li>
              ))}
            </ul>
            <p>{data.getRecipeByName.description}</p>
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
          <div className="recipe-method">
            <div className="ingredients">
              <h2>Ingredients</h2>
              <ul>
                {data.getRecipeByName.ingredientList.map((obj, index) => (
                  <li key={index} onClick={handleIngredientLineThrough}>
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
      {/* Remove Footer? Remove Footer everywhere? */}
      <Footer />
    </div>
  );
}

export default Recipe;
