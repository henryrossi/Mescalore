import * as React from "react";
import { IconTrashX, IconPencilPlus } from "@tabler/icons-react";

export default function RecipeEditorInstructionsPage({ recipeData, dispatch }) {
  return (
    <>
      <h2>Instructions</h2>
      <ol>
        {recipeData.instructions.map((instructions, index) => (
          <li key={index}>
            <textarea
              defaultValue={instructions}
              onChange={(e) =>
                dispatch({
                  type: "changeInstruction",
                  instruction: e.target.value,
                  index: index,
                })
              }
            />
            <button
              className="button-icon delete-instruction-icon"
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "removeListItem",
                  variable: "instructions",
                  index: index,
                });
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
          dispatch({ type: "addInstruction" });
        }}
      >
        <IconPencilPlus />
      </button>
    </>
  );
}
