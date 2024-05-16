import * as React from "react";
import { IconTrashX, IconPencilPlus } from "@tabler/icons-react";
import { RecipeData2 } from "../graphQL";

export default function RecipeEditorIngredientsPage({ 
  recipeData, 
  setRecipeData 
} : { 
  recipeData: RecipeData2, 
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeData2>> 
}) {
  return (
    <>
      <h2>Ingredients</h2>
      <p>
        Ingredients are divided into a measurement section and the ingredient
        themselves. For example, 2 Tbsp butter should be divided into 2 Tbsp,
        the measurement, and butter, the ingredient. The measurement section may
        be left blank.
      </p>
      <ul>
        {recipeData.ingredients.map((object, index) => (
          <li key={index}>
            <input
              value={object.measurement}
              onChange={(e) => {
                let ingredients = [...recipeData.ingredients];
                ingredients[index] = {
                  measurement: e.target.value,
                  ingredient: object.ingredient,
                };
                setRecipeData({...recipeData, ingredients: ingredients});
              }}
            />
            <input
              value={object.ingredient}
              onChange={(e) => {
                let ingredients = [...recipeData.ingredients];
                ingredients[index] = {
                  measurement: object.measurement,
                  ingredient: e.target.value,
                };
                setRecipeData({...recipeData, ingredients: ingredients});
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                const ingredients = [...recipeData.ingredients];
                ingredients.splice(index, 1);
                setRecipeData({...recipeData, ingredients: ingredients});
              }}
              className="button-icon delete-ingredient-icon"
            >
              <IconTrashX />
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={(e) => {
          e.preventDefault();
          setRecipeData({...recipeData, ingredients: [
            ...recipeData.ingredients, {ingredient: "", measurement: ""}
          ]});
        }}
        className="button-icon add-icon"
      >
        <IconPencilPlus />
      </button>
    </>
  );
}
