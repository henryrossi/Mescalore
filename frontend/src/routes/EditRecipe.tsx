import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_RECIPE_QUERY,
  GET_S3_PRESIGNED_URL,
  EDIT_RECIPE_MUTATION,
  DELETE_RECIPE_MUTATION
} from "../graphQL";
import { RecipeData2, RecipeReturnType } from "../types";
import Loading from "../components/Loading";
import RecipeEditor from "../components/RecipeEditor";

export default function EditRecipe() {
  const { recipeName } = useParams();
  const navigate = useNavigate();
  const [recipeId, setRecipeId] = React.useState("");
  const [recipeData, setRecipeData] = React.useState<RecipeData2>({
    name: "",
    servings: "",
    time: "",
    description: "",
    categories: [],
    picture: null,
    imageURL: null,
    ingredients: [],
    instructions: [],
  });

  /* Apollo Queries and Mutations */

  const { loading, error } = useQuery(GET_RECIPE_QUERY, {
    variables: {
      name: recipeName,
    },
    onCompleted: (data) => {
      const recipe: RecipeReturnType = data.getRecipeByName;
      setRecipeId(recipe.id);
      setRecipeData({
        ...recipe, 
        categories: recipe.category.map((categories) =>
          categories.name.toLowerCase()
        ),
        picture: null,
        ingredients: recipe.ingredientList.map((object) => ({
          measurement: object.measurement,
          ingredient: object.ingredient.name,
        })),
        instructions: recipe.instructions.split("\r")
      });
    },
  });

  const {
    error: errorURL,
    data: s3URL,
  } = useQuery(GET_S3_PRESIGNED_URL , {
    fetchPolicy: "no-cache" 
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

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
      setRecipeData({...recipeData, imageURL: s3URL.getS3PresignedUrl.split('?')[0]});
    }
    const imageURL = recipeData.picture ? s3URL.getS3PresignedUrl.split('?')[0] : null;
    updateRecipe({
      variables: {
        recipeId: recipeId,
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe({ variables: { recipeId: recipeId } });
    }
  };

  /* Page rendering */

  if (error) {
    console.log(error.message);
    return "recipe not found";
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <RecipeEditor
          recipeData={recipeData}
          setRecipeData={setRecipeData}
          onSubmit={onSubmit}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}
