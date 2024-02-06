import React from "react";
import { Link } from "react-router-dom";
import "./RecipeList.css";

export default function RecipeList({ recipes }) {
  return (
    <div className="recipes-container">
      <ul>
        {recipes &&
          recipes.map((recipe) => (
            <li className="card" key={recipe.name}>
              <Link to={"/" + recipe.name}>
                {recipe.imageURL ? 
                <img src={recipe.imageURL} alt="" /> : 
                <div className="noPicture">
                  <p className="message">image unavailable</p>
                </div>}
                <p>{recipe.name}</p>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
