import * as React from "react";
import { useMutation, gql } from "@apollo/client";
import { Params, useLoaderData, useNavigate } from "react-router-dom";
import { RecipeEditorData } from "../types";
import RecipeEditor from "../components/RecipeEditor";
import client from "../client";

export const GET_S3_PRESIGNED_URL = gql`
  query S3PresignedUrl {
    getS3PresignedUrl
  }
`;

export const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipe(
    $categories: [String]!
    $description: String!
    $sections: [IngredientSectionInput]!
    $instructions: String!
    $name: String!
    $servings: Int!
    $time: Int!
    $imageURL: String
  ) {
    createRecipe(
      recipeData: {
        name: $name
        categories: $categories
        description: $description
        time: $time
        servings: $servings
        imageURL: $imageURL
        sections: $sections
        instructions: $instructions
      }
    ) {
      success
    }
  }
`;

export async function loader({
  params,
}: {
  params: Params<"recipeName">;
}): Promise<string> {
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

export default function CreateRecipe() {
  const navigate = useNavigate();
  const S3URL = useLoaderData() as string;
  const [recipeData, setRecipeData] = React.useState<RecipeEditorData>({
    id: "",
    name: "",
    description: "",
    time: "",
    servings: "",
    categories: [],
    picture: null,
    imageURL: null,
    ingredientSections: [
      {
        id: generateId(),
        name: "",
        ingredients: [{ id: generateId(), ingredient: "", measurement: "" }],
      },
    ],
    instructions: [{ id: generateId(), text: "" }],
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

  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (recipeData.picture) {
      const response = await fetch(S3URL, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: recipeData.picture,
      });
      if (!response.ok) return;
      setRecipeData({ ...recipeData, imageURL: S3URL.split("?")[0] });
    }
    const imageURL = recipeData.picture ? S3URL.split("?")[0] : null;
    createRecipe({
      variables: {
        name: recipeData.name,
        time: parseInt(recipeData.time),
        servings: parseInt(recipeData.servings),
        description: recipeData.description,
        categories: recipeData.categories,
        imageURL: imageURL,
        sections: recipeData.ingredientSections.map((section) => ({
          name: section.name,
          ingredients: section.ingredients.map((ingr) => ({
            ingredient: ingr.ingredient,
            measurement: ingr.measurement,
          })),
        })),
        instructions: recipeData.instructions.map((i) => i.text).join("\r"),
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
