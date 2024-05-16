import * as React from "react";
import AutosizeInput from "react-18-input-autosize";

export default function RecipeEditorInfoPage({
  recipeData,
  dispatch,
  autosizeInputStyle,
}) {
  const categoryChocies = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "dessert",
    "beverage",
  ];

  return (
    <>
      <h2>Name</h2>
      <input
        type="text"
        value={recipeData.name}
        onChange={(e) =>
          dispatch({
            type: "changeInput",
            value: e.target.value,
            variable: "name",
          })
        }
      />
      <div className="servings-time-container">
        <h2>Servings</h2>
        <AutosizeInput
          value={recipeData.servings}
          style={{ display: "block" }}
          inputStyle={autosizeInputStyle}
          onChange={(e) =>
            dispatch({
              type: "changeInput",
              value: e.target.value,
              variable: "servings",
            })
          }
        />
      </div>
      <div className="servings-time-container">
        <h2>Minutes</h2>
        <AutosizeInput
          value={recipeData.time}
          style={{ display: "block" }}
          inputStyle={autosizeInputStyle}
          onChange={(e) =>
            dispatch({
              type: "changeInput",
              value: e.target.value,
              variable: "time",
            })
          }
        />
      </div>
      <ul>
        {categoryChocies.map((category) => (
          <li key={category} className="tag">
            <button
              className={
                recipeData.categories.includes(category) ? "" : "unselected"
              }
              onClick={() => {
                dispatch({
                  type: "changeCategories",
                  category: category,
                });
              }}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
