import { React, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_RECIPE_QUERY,
  EDIT_RECIPE_MUTATION,
  DELETE_RECIPE_MUTATION,
} from "../graphQL.js";
import recipeStateReducer from "../recipeStateRecuder.js";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import RecipeEditor from "../components/RecipeEditor.jsx";
import Footer from "../components/Footer";

export default function EditRecipe() {
  const { recipeName } = useParams();
  const navigate = useNavigate();
  const [recipeData, dispatch] = useReducer(recipeStateReducer, {
    id: 0,
    name: "",
    servings: "",
    time: "",
    description: "",
    categories: [],
    picture: null,
    base64picture: null,
    ingredients: [],
    instructions: [],
  });

  /* Apollo Queries and Mutations */

  const { loading, error } = useQuery(GET_RECIPE_QUERY, {
    variables: {
      name: recipeName,
    },
    onCompleted: (data) => {
      dispatch({ type: "query", recipe: data.getRecipeByName });
    },
  });

  const [updateRecipe] = useMutation(EDIT_RECIPE_MUTATION, {
    onCompleted: (data) => {
      if (!data.editRecipe.updated) {
        window.alert("Recipe failed to update");
        return;
      }
      navigate("/");
    },
    onError: (error) => {
      window.alert("Error: " + error.message);
    },
  });

  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    onCompleted: (data) => {
      if (!data.deleteRecipe.deleted) {
        window.alert("Recipe failed to delete");
        return;
      }
      navigate("/");
    },
    onError: (error) => {
      window.alert("Error: " + error.message);
    },
  });

  /* Logic handling for the form */

  const onSubmit = (event) => {
    event.preventDefault();
    updateRecipe({
      variables: {
        recipeId: recipeData.id,
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe({ variables: { recipeId: recipeData.id } });
    }
  };

  /* Page rendering */

  if (error) {
    console.log(error.message);
    return "recipe not found";
  }

  return (
    <div id="fullpage">
      <Navbar currentSubsite={"recipes"} />
      {loading ? (
        <Loading />
      ) : (
        <RecipeEditor
          recipeData={recipeData}
          dispatch={dispatch}
          onSubmit={onSubmit}
          handleDelete={handleDelete}
        />
      )}
      <Footer />
    </div>
  );
}
