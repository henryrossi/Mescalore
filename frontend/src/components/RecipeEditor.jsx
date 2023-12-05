import { React, useState } from "react";
import Unavailable from "../components/Unavailable";
import RecipeEditorInfoPage from "./RecipeEditorInfoPage";
import RecipeEditorDescriptionPage from "./RecipeEditorDescriptionPage";
import RecipeEditorPicturePage from "./RecipeEditorPicturePage";
import RecipeEditorIngredientsPage from "./RecipeEditorIngredientsPage";
import RecipeEditorInstructionsPage from "./RecipeEditorInstructionsPage";
import "./RecipeEditor.css";

export default function RecipeEditor({
  recipeData,
  dispatch,
  onSubmit,
  handleDelete,
}) {
  const [currentFormPage, setCurrentFormPage] = useState(0);

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

  const getSidebarClassBasedOnPage = (page) => {
    return currentFormPage === page ? "current-page" : "";
  };

  return (
    <div className="recipe-editor">
      <h1>Recipe Editor</h1>
      <div className="sidebar">
        <button
          className={getSidebarClassBasedOnPage(0)}
          onClick={() => setCurrentFormPage(0)}
        >
          Info
        </button>
        <button
          className={getSidebarClassBasedOnPage(1)}
          onClick={() => setCurrentFormPage(1)}
        >
          Description
        </button>
        <button
          className={getSidebarClassBasedOnPage(2)}
          onClick={() => setCurrentFormPage(2)}
        >
          Picture
        </button>
        <button
          className={getSidebarClassBasedOnPage(3)}
          onClick={() => setCurrentFormPage(3)}
        >
          Ingredients
        </button>
        <button
          className={getSidebarClassBasedOnPage(4)}
          onClick={() => setCurrentFormPage(4)}
        >
          Instructions
        </button>
      </div>
      <div className="input-container">
        {currentFormPage === 0 && (
          <RecipeEditorInfoPage
            recipeData={recipeData}
            dispatch={dispatch}
            autosizeInputStyle={autosizeInputStyle}
          />
        )}
        {currentFormPage === 1 && (
          <RecipeEditorDescriptionPage
            recipeData={recipeData}
            dispatch={dispatch}
          />
        )}
        {currentFormPage === 2 && (
          <RecipeEditorPicturePage
            recipeData={recipeData}
            dispatch={dispatch}
          />
        )}
        {currentFormPage === 3 && (
          <RecipeEditorIngredientsPage
            recipeData={recipeData}
            dispatch={dispatch}
            autosizeInputStyle={autosizeInputStyle}
          />
        )}
        {currentFormPage === 4 && (
          <RecipeEditorInstructionsPage
            recipeData={recipeData}
            dispatch={dispatch}
          />
        )}
        <button className="standard-recipe-button">
          {handleDelete ? "Update Recipe" : "Create Recipe"}
        </button>
        {handleDelete && (
          <button onClick={handleDelete} className="delete-recipe-button">
            Delete Recipe
          </button>
        )}
      </div>
    </div>
  );
}
