import * as React from "react";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";
import "./RecipeList.css";

export default function RecipeList({ recipes } : { recipes: RecipeData[] }) {
  return (
    <section className="main-container-recipe-list">
      <ul>
        {recipes &&
          recipes.map((recipe) => (
            <li className="border-black hover-blue-drop-shadow" key={recipe.name}>
              <Link 
                className="link-recipe-list"
                to={"/" + recipe.name}
              >
                {recipe.imageURL ? 
                <img src={recipe.imageURL} alt="" /> : 
                <div className="noPicture">
                  <p className="message">image unavailable</p>
                </div>}
                <p className="jua black text-xl">{recipe.name}</p>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
