import * as React from "react";
import { Link } from "react-router-dom";
import { RecipePreview } from "../types";
import "./RecipeList.css";

export default function RecipeList({ recipes } : { recipes: RecipePreview[] }) {
  return (
    <section className="main-container__recipe-list">
      <ul className="list-container__recipe-list">
        {recipes &&
          recipes.map((recipe) => (
            <li className="border-black hover-blue-drop-shadow" key={recipe.name}>
              <Link 
                className="link__recipe-list"
                to={"/" + recipe.name}
              >
                {recipe.imageURL ? 
                <img src={recipe.imageURL} alt="" /> : 
                <div className="no-image">
                  <p className="red">image unavailable</p>
                </div>}
                <p className="jua black text-xl">{recipe.name}</p>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
