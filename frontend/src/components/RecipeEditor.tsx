import * as React from "react";
import Unavailable from "../components/Unavailable";
import "./RecipeEditor.css";
import { RecipeData2 } from "../types";
import authContext from "../authContext";
import RecipeEditorPicturePage from "./RecipeEditorPicturePage";

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
  const { authenticated } = React.useContext(authContext);

  if (!authenticated) {
    return <Unavailable />;
  }

  const categoryChocies = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "dessert",
    "beverage",
  ];
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let categories = [...recipeData.categories];
    const category = e.target.value;
    if (e.target.checked) {
      categories.push(category);
      setRecipeData({...recipeData, categories: categories});
      return;
    }
    const index = categories.indexOf(category);
    if (index !== -1) {
      categories.splice(index, 1);
      setRecipeData({...recipeData, categories: categories});
    }
  }

  console.log(recipeData);

  return (
    <div className="recipe-editor-container">
        <form>
          <div>
            <label htmlFor="name_input">Enter the recipe name.</label>
            <input
              type="text"
              id="name_input"
              value={recipeData.name}
              onChange={(e) =>
                setRecipeData({...recipeData, name: e.target.value})
              }
            />
          </div>
          <div>
            <label htmlFor="servings_input">How many servings?</label>
            <input
              type="text"
              id="servings_input"
              value={recipeData.servings}
              onChange={(e) =>
                setRecipeData({...recipeData, servings: e.target.value})
              }
            />
          </div>
          <div>
            <label htmlFor="time_input">Enter the number of minutes needed to prepare.</label>
            <input
              type="text"
              id="time_input"
              value={recipeData.time}
              onChange={(e) =>
                setRecipeData({...recipeData, time: e.target.value})
              }
            />
          </div>
          <fieldset className="categories-editor">
            <legend>Choose what categories this recipe falls into.</legend>
            {categoryChocies.map(category => 
              <label key={category}>
                <input 
                  type="checkbox" 
                  value={category}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            )}
          </fieldset>
          <div>
            <label htmlFor="desc_input">Recipe Description</label>
            <textarea
              id="desc_input"
              defaultValue={recipeData.description}
              onChange={(e) =>
                setRecipeData({...recipeData, description: e.target.value})
              }
            />
          </div>
          <button className="" onClick={onSubmit}>
            {handleDelete ? "Update Recipe" : "Create Recipe"}
          </button>
        </form>

        {handleDelete && (
          <button onClick={handleDelete} className="delete-button">
            Permanently Delete Recipe
          </button>
        )}
    </div>
  );
}
