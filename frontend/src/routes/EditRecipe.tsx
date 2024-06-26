import * as React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { Params } from "react-router-dom"
import { gql, useMutation } from "@apollo/client";
import client from "../client";
import {
  GET_S3_PRESIGNED_URL,
  DELETE_RECIPE_MUTATION
} from "../graphQL";
import { RecipeEditorData, RecipeGraphQLReturn } from "../types";
import RecipeEditor from "../components/RecipeEditor";

const GET_RECIPE_QUERY = gql`
  query recipeQuery($name: String!) {
    getRecipeByName(name: $name) {
      id
      name
      description
      servings
      time
      category {
        name
      }
      imageURL
      ingredientSections {
        name
        ingredientList {
          measurement
          ingredient {
            name
          }
        }
      }
      instructions
      favorite
    }
  }
`;

export const EDIT_RECIPE_MUTATION = gql`
  mutation editRecipe(
    $categories: [String]!
    $description: String!
    $sections: [IngredientSectionInput]!
    $instructions: String!
    $name: String!
    $servings: Int!
    $time: Int!
    $imageURL: String
    $recipeId: ID!
  ) {
    editRecipe(
      recipeId: $recipeId
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
      updated
    }
  }
`;


function decomposeGraphQLData(gqlData: RecipeGraphQLReturn) : RecipeEditorData {
  return ({
    id: gqlData.id,
    name: gqlData.name,
    description: gqlData.description,
    servings: gqlData.servings,
    time: gqlData.time,
    categories: gqlData.category.map(cat => cat.name.toLowerCase()),
    picture: null,
    imageURL: gqlData.imageURL,
    ingredientSections: gqlData.ingredientSections.map(section => 
      ({
	name: section.name,
        ingredients: section.ingredientList.map(ingr => 
          ({
            measurement: ingr.measurement,
            ingredient: ingr.ingredient.name,
          })
        )
      })
    ),
    instructions: gqlData.instructions.split("\r"),
  })
}

interface EditRecipeLoaderData {
  data: RecipeEditorData,
  s3URL: string,
}

export async function loader({ params }: { params: Params<"recipeName">}) : Promise<EditRecipeLoaderData> {
  const result = await client.query({
    query: GET_RECIPE_QUERY,
    fetchPolicy: "no-cache",
    variables: {
      name: params.recipeName,
    },
  });

  const presignedURL = await client.query({
    query: GET_S3_PRESIGNED_URL,
    fetchPolicy: "no-cache" 
  })

  if (result.error) {
    console.log(result.error);
    throw Error(result.error.message);
  }

  if (presignedURL.error) {
    console.log(presignedURL.error);
    throw Error(presignedURL.error.message);
  }

  return ({
    data: decomposeGraphQLData(result.data.getRecipeByName),
    s3URL: presignedURL.data.getS3PresignedUrl,
  });
}
export default function EditRecipe() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as EditRecipeLoaderData
  const [recipeData, setRecipeData] = React.useState<RecipeEditorData>(loaderData.data);

console.log(recipeData);
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
    if (recipeData.picture) {
      const response = await fetch(loaderData.s3URL, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: recipeData.picture
      })
      if (!response.ok) return;
      setRecipeData({...recipeData, imageURL: loaderData.s3URL.split('?')[0]});
    }
    const imageURL = recipeData.picture ? loaderData.s3URL.split('?')[0] : null;
    updateRecipe({
      variables: {
        recipeId: recipeData.id,
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe({ variables: { recipeId: recipeData.id } });
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
