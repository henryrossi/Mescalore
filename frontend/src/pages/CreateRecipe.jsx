import { React, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CREATE_RECIPE_MUTATION } from "../graphQL.js";
import recipeStateReducer from "../recipeStateRecuder.js";
import Navbar from "../components/Navbar";
import RecipeEditor from "../components/RecipeEditor.jsx";
import Footer from "../components/Footer";
import "./CreateRecipe.css";

function CreateRecipe() {
  const navigate = useNavigate();
  const [recipeData, dispatch] = useReducer(recipeStateReducer, {
    name: "",
    description: "",
    time: "",
    servings: "",
    categories: [],
    picture: null,
    base64picture: null,
    ingredients: [{ingredient: "", measurement: ""},],
    instructions: [""],
  });

  /* Apollo Queries and Mutations */

  const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION, {
    onCompleted: (data) => {
      if (!data.createRecipe.success) {
        window.alert("Failed to create recipe");
        return;
      }
      navigate("/");
    },
    onError: (error) => {
      window.alert("Error: " + error.message);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createRecipe({
      variables: {
        name: recipeData.name,
        time: parseInt(recipeData.time),
        servings: parseInt(recipeData.servings),
        description: recipeData.description,
        categories: recipeData.categories,
        picture: recipeData.picture,
        measurements: recipeData.ingredients.map(
          (object) => object.measurement
        ),
        ingredients: recipeData.ingredients.map((object) => object.ingredient),
        instructions: recipeData.instructions.join("\r"),
      },
    });
  };

  /* Page rendering */

  return (
    <div id="fullpage">
      <Navbar currentSubsite={"recipes"} />
      <RecipeEditor recipeData={recipeData} dispatch={dispatch} onSubmit={onSubmit} />
      <Footer />
    </div>
  );
}

export default CreateRecipe;
