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
                  <img src={require("../images/temp.jpg")} alt="" />
                  <p>{recipe.name}</p>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
