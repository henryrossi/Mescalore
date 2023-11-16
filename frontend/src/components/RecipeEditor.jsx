import { React } from "react";
import { IconTrashX, IconPencilPlus } from "@tabler/icons-react";
import AutosizeInput from "react-18-input-autosize";
import Unavailable from "../components/Unavailable";
import "./RecipeEditor.css";

export default function RecipeEditor({
  recipeData,
  dispatch,
  onSubmit,
  handleDelete,
}) {
  const categoryChocies = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "dessert",
    "beverage",
  ];

  const autosizeInputStyle = {
    minWidth: 200,
    maxWidth: 400,
    backgroundColor: "#f9f9f9",
    border: "1px solid #bababa",
    borderRadius: 10,
    height: 36,
    marginTop: 20,
    marginRight: 20,
    paddingLeft: 10,
  };

  if (!localStorage.getItem("token")) {
    return <Unavailable />;
  }

  return (
    <form className="recipe-editor" onSubmit={onSubmit}>
      <h1>Recipe Editor</h1>
      <label>
        Name
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
      </label>
      <label className="autosize-input-label">
        Servings
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
      </label>
      <label className="autosize-input-label">
        Minutes
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
      </label>
      <ul>
        {categoryChocies.map((category) => (
          <li key={category} className="tag">
            <button
              className={
                recipeData.categories.includes(category) ? "" : "unselected"
              }
              onClick={(e) => {
                e.preventDefault();
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
      <label>
        Description
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
      </label>
      {recipeData.picture ? (
        <img src={URL.createObjectURL(recipeData.picture)} alt="" />
      ) : recipeData.base64picture ? (
        <img
          src={
            "data:image/jpeg;charset=utf-8;base64," +
            atob(recipeData.base64picture)
          }
          alt=""
        />
      ) : (
        <></>
      )}
      <div className="picture-input-controls">
        {recipeData.picture && (
          <button
            className="standard-recipe-button"
            onClick={(e) => {
              e.preventDefault();
              dispatch({
                /* Maybe create a remove Image action type */
                type: "changeInput",
                variable: "picture",
                value: null,
              });
            }}
          >
            Discard current upload
          </button>
        )}
        <label className="standard-recipe-button picture-upload-label">
          <input
            className="picture-upload-input"
            type="file"
            onChange={(e) => {
              dispatch({
                type: "changeInput",
                variable: "picture",
                value: e.target.files[0],
              });
            }}
          />
          Upload new picture
        </label>
      </div>
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
      <button type="submit" className="standard-recipe-button">
        Update Recipe
      </button>
      {handleDelete && (
        <button onClick={handleDelete} className="delete-recipe-button">
          Delete Recipe
        </button>
      )}
    </form>
  );
}
