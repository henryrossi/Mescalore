import * as React from "react";
import Unavailable from "../components/Unavailable";
import RecipeEditorInfoPage from "./RecipeEditorInfoPage";
import RecipeEditorDescriptionPage from "./RecipeEditorDescriptionPage";
import RecipeEditorPicturePage from "./RecipeEditorPicturePage";
import RecipeEditorIngredientsPage from "./RecipeEditorIngredientsPage";
import RecipeEditorInstructionsPage from "./RecipeEditorInstructionsPage";
import "./RecipeEditor.css";
import { RecipeData2 } from "../types";

export default function RecipeEditor({
  recipeData,
  setRecipeData,
  onSubmit,
  handleDelete,
} : { 
  recipeData: RecipeData2, 
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeData2>>, 
  onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
  handleDelete: (() => void) | null
}) {
  const [currentEditorPage, setCurrentEditorPage] = React.useState(0);

  // const autosizeInputStyle = {
  //   minWidth: 200,
  //   maxWidth: 400,
  //   fontSize: "0.95em",
  //   backgroundColor: "#ffffff",
  //   border: "1px solid #bababa",
  //   borderRadius: 10,
  //   height: 36,
  //   marginBottom: 20,
  //   marginRight: 20,
  //   paddingLeft: 10,
  // };

  const getSidebarClassBasedOnPage = (page: number) => {
    return currentEditorPage === page ? "current-page" : "";
  };

  if (!localStorage.getItem("token")) {
    return <Unavailable />;
  }

  return (
    <div className="recipe-editor">
      <h1>Recipe Editor</h1>
      <div className="sidebar">
        <button
          className={getSidebarClassBasedOnPage(0)}
          onClick={() => setCurrentEditorPage(0)}
        >
          Info
        </button>
        <button
          className={getSidebarClassBasedOnPage(1)}
          onClick={() => setCurrentEditorPage(1)}
        >
          Description
        </button>
        <button
          className={getSidebarClassBasedOnPage(2)}
          onClick={() => setCurrentEditorPage(2)}
        >
          Picture
        </button>
        <button
          className={getSidebarClassBasedOnPage(3)}
          onClick={() => setCurrentEditorPage(3)}
        >
          Ingredients
        </button>
        <button
          className={getSidebarClassBasedOnPage(4)}
          onClick={() => setCurrentEditorPage(4)}
        >
          Instructions
        </button>
      </div>
      <div className="input-container">
        {currentEditorPage === 0 && (
          <RecipeEditorInfoPage
            recipeData={recipeData}
            setRecipeData={setRecipeData}
          />
        )}
        {currentEditorPage === 1 && (
          <RecipeEditorDescriptionPage
            recipeData={recipeData}
            setRecipeData={setRecipeData}
          />
        )}
        {currentEditorPage === 2 && (
          <RecipeEditorPicturePage
            recipeData={recipeData}
            setRecipeData={setRecipeData}
          />
        )}
        {currentEditorPage === 3 && (
          <RecipeEditorIngredientsPage
            recipeData={recipeData}
            setRecipeData={setRecipeData}
          />
        )}
        {currentEditorPage === 4 && (
          <RecipeEditorInstructionsPage
            recipeData={recipeData}
            setRecipeData={setRecipeData}
          />
        )}
        {currentEditorPage < 4 ? (
          <button
            className="page-control-button"
            onClick={() => setCurrentEditorPage(currentEditorPage + 1)}
          >
            Next
          </button>
        ) : (
          <button className="page-control-button submit-button" onClick={onSubmit}>
            {handleDelete ? "Update Recipe" : "Create Recipe"}
          </button>
        )}
        {currentEditorPage > 0 && (
          <button
            className="page-control-button"
            onClick={() => setCurrentEditorPage(currentEditorPage - 1)}
          >
            Back
          </button>
        )}
        {handleDelete && (
          <button onClick={handleDelete} className="delete-button">
            Permanently Delete Recipe
          </button>
        )}
      </div>
    </div>
  );
}
