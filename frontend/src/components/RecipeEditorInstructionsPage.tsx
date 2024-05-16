import * as React from "react";
import { IconTrashX, IconPencilPlus } from "@tabler/icons-react";
import { RecipeData2 } from "../types";

export default function RecipeEditorInstructionsPage({ 
  recipeData, 
  setRecipeData 
} : { 
  recipeData: RecipeData2, 
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeData2>> 
}) {
  return (
    <>
      <h2>Instructions</h2>
      <ol>
        {recipeData.instructions.map((instructions, index) => (
          <li key={index}>
            <textarea
              defaultValue={instructions}
              onChange={(e) => {
                let instructions = [...recipeData.instructions];
                instructions[index] = e.target.value;
                setRecipeData({...recipeData, instructions: instructions});
              }}
            />
            <button
              className="button-icon delete-instruction-icon"
              onClick={(e) => {
                e.preventDefault();
                const instructions = [...recipeData.instructions];
                instructions.splice(index, 1);
                setRecipeData({...recipeData, instructions: instructions});
              }}
            >
              <IconTrashX />
            </button>
          </li>
        ))}
      </ol>
      <button
        className="button-icon add-icon"
        onClick={(e) => {
          e.preventDefault();
          setRecipeData({...recipeData, instructions: [...recipeData.instructions, ""]});
        }}
      >
        <IconPencilPlus />
      </button>
    </>
  );
}
