import * as React from "react";
import { RecipeData2 } from "../graphQL";

export default function RecipeEditorDescriptionPage({ 
  recipeData, 
  setRecipeData
} : { 
  recipeData: RecipeData2, 
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeData2>> 
}) {
  return (
    <>
      <h2>Description</h2>
      <textarea
        defaultValue={recipeData.description}
        onChange={(e) =>
          setRecipeData({...recipeData, description: e.target.value})
        }
      />
    </>
  );
}
