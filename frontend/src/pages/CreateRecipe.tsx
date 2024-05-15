import * as React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CREATE_RECIPE_MUTATION, GET_S3_PRESIGNED_URL } from "../graphQL.js";
import recipeStateReducer from "../recipeStateRecuder.js";
import Navbar from "../components/Navbar";
import RecipeEditor from "../components/RecipeEditor.jsx";
import Footer from "../components/Footer";

function CreateRecipe() {
  const navigate = useNavigate();
  const [recipeData, dispatch] = React.useReducer(recipeStateReducer, {
    name: "",
    description: "",
    time: "",
    servings: "",
    categories: [],
    picture: null,
    imageURL: null,
    ingredients: [{ingredient: "", measurement: ""},],
    instructions: [""],
  });

  /* Can use session/local storage if I want to make form input state persist through refreshes */

  /* Apollo Queries and Mutations */

  const {
    error: errorURL,
    data: s3URL,
  } = useQuery(GET_S3_PRESIGNED_URL , {
    fetchPolicy: "no-cache" 
  });

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

  const onSubmit = async (event) => {
    event.preventDefault();
    if (recipeData.picture && !errorURL) {
      const response = await fetch(s3URL.getS3PresignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: recipeData.picture
      })
      if (!response.ok) return;
      dispatch({
        type: "addImageURL",
        url: s3URL.getS3PresignedUrl.split('?')[0],
      });
    }
    const imageURL = recipeData.picture ? s3URL.getS3PresignedUrl.split('?')[0] : null;
    createRecipe({
      variables: {
        name: recipeData.name,
        time: parseInt(recipeData.time),
        servings: parseInt(recipeData.servings),
        description: recipeData.description,
        categories: recipeData.categories,
        imageURL: imageURL,
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
