import React from "react";
import { IconTrashX, IconPencilPlus } from "@tabler/icons-react";
import AutosizeInput from "react-18-input-autosize";
import "./RecipeEditor.css";

export default function RecipeEditorIngredientsPage({ recipeData, dispatch, autosizeInputStyle }) {
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
            <AutosizeInput
              value={object.measurement}
              inputStyle={autosizeInputStyle}
              onChange={(e) =>
                dispatch({
                  type: "changeIngredient",
                  ingredient: {
                    measurement: e.target.value,
                    ingredient: object.ingredient,
                  },
                  index: index,
                })
              }
            />
            <AutosizeInput
              value={object.ingredient}
              inputStyle={autosizeInputStyle}
              onChange={(e) =>
                dispatch({
                  type: "changeIngredient",
                  ingredient: {
                    measurement: object.measurement,
                    ingredient: e.target.value,
                  },
                  index: index,
                })
              }
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "removeListItem",
                  variable: "ingredients",
                  index: index,
                });
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
          dispatch({ type: "addIngredient" });
        }}
        className="button-icon add-icon"
      >
        <IconPencilPlus />
      </button>
    </>
  );
}
