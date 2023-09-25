import { React, useState } from "react";
import { useQuery } from "@apollo/client";
import { FILTER_RECIPES_QUERY } from "../graphQL.js"
import Navbar from "../components/Navbar";
import RecipeList from "../components/RecipeList";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import "./Recipes.css";

function Recipes() {
  const tags = ["breakfast", "lunch", "dinner", "snack", "dessert", "beverage"];
  const [selectedCategory, setSelectedCategory] = useState("");

  const { loading, error, data, refetch } = useQuery(FILTER_RECIPES_QUERY, {
    variables: {
      category: selectedCategory,
    },
  });

  const handleClick = (event) => {
    let category = event.target.innerText;
    if (category === selectedCategory) {
      category = "";
    }
    setSelectedCategory(category);
    refetch({
      category: category,
    });
  };

  if (error) console.log(error.message);

  return (
    <div id="fullpage">
      <Navbar />
      <h1 className="recipes">Explore some of our favorite recipes</h1>
      <section className="filter">
        <p> filter by </p>
        <ul>
          {tags.map((tag) => (
            <li key={tag}>
              <button
                className={tag === selectedCategory ? "selectedTag" : ""}
                onClick={handleClick}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {loading ? (
        <Loading />
      ) : (
        <RecipeList recipes={data.getRecipesByCategory} />
      )}
      <Footer />
    </div>
  );
}

export default Recipes;
