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
                  {recipe.base64picture ? (
                    <img
                      src={
                        "data:image/jpeg;charset=utf-8;base64," +
                        atob(recipe.base64picture)
                      }
                      alt=""
                    />
                  ) : (
                    <div className="noPicture">
                      <p className="message">image unavailable</p>
                    </div>
                  )}
                  <p>{recipe.name}</p>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
