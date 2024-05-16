import * as React from "react";
import { RecipeData2 } from "../types";

export default function RecipeEditorInfoPage({
  recipeData,
  setRecipeData,
} : { 
  recipeData: RecipeData2, 
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeData2>> 
}) {
  const categoryChocies = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "dessert",
    "beverage",
  ];

  const handleCategoryChange = (category: string) => {
    let categories = [...recipeData.categories];
    if (categories.includes(category)) {
      categories.splice(recipeData.categories.indexOf(category), 1);
      setRecipeData({...recipeData, categories: categories});
      return;
    }
    categories.push(category);
    setRecipeData({...recipeData, categories: categories});
  }

  return (
    <>
      <h2>Name</h2>
      <input
        type="text"
        value={recipeData.name}
        onChange={(e) =>
          setRecipeData({...recipeData, name: e.target.value})
        }
      />
      <div className="servings-time-container">
        <h2>Servings</h2>
        <input
          value={recipeData.servings}
          style={{ display: "block" }}
          onChange={(e) =>
            setRecipeData({...recipeData, servings: e.target.value})
          }
        />
      </div>
      <div className="servings-time-container">
        <h2>Minutes</h2>
        <input
          value={recipeData.time}
          style={{ display: "block" }}
          onChange={(e) =>
            setRecipeData({...recipeData, time: e.target.value})
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
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
