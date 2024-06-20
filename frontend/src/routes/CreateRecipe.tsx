import * as React from "react";
import { useMutation } from "@apollo/client";
import { Params, useLoaderData, useNavigate } from "react-router-dom";
import { CREATE_RECIPE_MUTATION, GET_S3_PRESIGNED_URL } from "../graphQL";
import { RecipeEditorData } from "../types";
import RecipeEditor from "../components/RecipeEditor";
import client from "../client";

export async function loader({ params }: {params: Params<"recipeName">}) : Promise<string> {
  const result = await client.query({
    query: GET_S3_PRESIGNED_URL,
    fetchPolicy: "no-cache",
  });

  if (result.error) {
    console.log(result.error.message);
    throw Error(result.error.message);
  }

  return result.data.getS3PresignedUrl;
}

export default function CreateRecipe() {
  const navigate = useNavigate();
  const S3URL = useLoaderData() as string;
  const [recipeData, setRecipeData] = React.useState<RecipeEditorData>( {
    id: "",
    name: "",
    description: "",
    time: "",
    servings: "",
    categories: [],
    picture: null,
    imageURL: null,
    ingredientSections: [{
      name: "",
      ingredientList: [{ingredient: "", measurement: ""},],
    }],
    instructions: [""],
  });

  /* Can use session/local storage if I want to make form input state persist through refreshes */

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

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (recipeData.picture) {
      const response = await fetch(S3URL, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: recipeData.picture
      })
      if (!response.ok) return;
      setRecipeData({...recipeData, imageURL: S3URL.split('?')[0]});
    }
    const imageURL = recipeData.picture ? S3URL.split('?')[0] : null;
    createRecipe({
      variables: {
        name: recipeData.name,
        time: parseInt(recipeData.time),
        servings: parseInt(recipeData.servings),
        description: recipeData.description,
        categories: recipeData.categories,
        imageURL: imageURL,
        sections: recipeData.ingredientSections,
        instructions: recipeData.instructions.join("\r"),
      },
    });
  };

  return (
    <RecipeEditor 
      recipeData={recipeData} 
      setRecipeData={setRecipeData} 
      onSubmit={onSubmit} 
      handleDelete={null} 
    />
  );
}
