import * as React from "react";

export default function RecipeEditorDescriptionPage({ recipeData, dispatch}) {
  return (
    <>
      <h2>Description</h2>
      <textarea
        defaultValue={recipeData.description}
        onChange={(e) =>
          dispatch({
            type: "changeInput",
            value: e.target.value,
            variable: "description",
          })
        }
      />
    </>
  );
}
