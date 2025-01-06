import * as React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { Params } from "react-router-dom";
import client from "../client";
import { RecipeEditorData } from "../types";
import RecipeEditor from "../components/RecipeEditor";

function generateRandomNumber() {
  return Math.random() * 1000000000;
}

const ids: number[] = [];
function generateId() {
  let id = generateRandomNumber();
  while (ids.includes(id)) {
    id = generateRandomNumber();
  }
  ids.push(id);
  return id;
}

function prepRecipeData(incoming: any): RecipeEditorData {
  return {
    id: incoming.id,
    name: incoming.name,
    description: incoming.description,
    servings: incoming.servings,
    time: incoming.time,
    categories: incoming.categories,
    picture: null,
    imageURL: incoming.imageURL,
    ingredientSections: incoming.ingredientSections.map((section: any) => ({
      id: generateId(),
      name: section.name,
      ingredients: section.ingredients.map((ingr: any) => ({
        id: generateId(),
        measurement: ingr.measurement,
        ingredient: ingr.ingredient,
      })),
    })),
    instructions: incoming.instructions.split("\r").map((inst: string) => ({
      id: generateId(),
      text: inst,
    })),
  };
}

interface EditRecipeLoaderData {
  data: RecipeEditorData;
  s3URL: string;
}

export async function loader({
  params,
}: {
  params: Params<"recipeName">;
}): Promise<EditRecipeLoaderData> {
  const url = "recipes/" + params.recipeName;
  const result = await client.get(url);

  const s3url = await client.get("recipes/presignedURL");

  if (s3url.status) {
    throw Error("Can't obtained presigned URL");
  }

  return {
    data: prepRecipeData(result.data),
    s3URL: s3url.data,
  };
}

export default function EditRecipe() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as EditRecipeLoaderData;

  const [recipeData, setRecipeData] = React.useState(loaderData.data);

  // const [updateRecipe] = useMutation(EDIT_RECIPE_MUTATION, {
  //   onCompleted: (data) => {
  //     if (!data.editRecipe.updated) {
  //       window.alert("Recipe failed to update");
  //       return;
  //     }
  //     navigate("/");
  //   },
  //   onError: (error) => {
  //     window.alert("Error: " + error.message);
  //   },
  // });
  //
  // const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
  //   onCompleted: (data) => {
  //     if (!data.deleteRecipe.deleted) {
  //       window.alert("Recipe failed to delete");
  //       return;
  //     }
  //     navigate("/");
  //   },
  //   onError: (error) => {
  //     window.alert("Error: " + error.message);
  //   },
  // });

  /* Logic handling for the form */

  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (recipeData.picture) {
      const response = await fetch(loaderData.s3URL, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: recipeData.picture,
      });
      if (!response.ok) return;
      setRecipeData({
        ...recipeData,
        imageURL: loaderData.s3URL.split("?")[0],
      });
    }
    const imageURL = recipeData.picture ? loaderData.s3URL.split("?")[0] : null;
    const res = await client.put("recipes/id/" + recipeData.id, {
      id: recipeData.id,
      name: recipeData.name,
      time: parseInt(recipeData.time),
      servings: parseInt(recipeData.servings),
      description: recipeData.description,
      categories: recipeData.categories,
      imageURL: imageURL,
      ingredientSections: recipeData.ingredientSections.map((section) => ({
        name: section.name,
        ingredients: section.ingredients.map((ingr) => ({
          ingredient: ingr.ingredient,
          measurement: ingr.measurement,
        })),
      })),
      instructions: recipeData.instructions.map((i) => i.text).join("\r"),
    });
    console.log(res);
    if (!res.status) {
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      const res = await client.delete("recipes/" + recipeData.name);
      if (!res.status) {
        navigate("/");
      }
    }
  };

  return (
    <RecipeEditor
      recipeData={recipeData}
      setRecipeData={setRecipeData}
      onSubmit={onSubmit}
      handleDelete={handleDelete}
    />
  );
}
