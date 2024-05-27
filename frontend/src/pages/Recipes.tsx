import * as React from "react";
import { useQuery } from "@apollo/client";
import { FILTER_RECIPES_QUERY } from "../graphQL";
import RecipeList from "../components/RecipeList";
import Loading from "../components/Loading";
import "./Recipes.css";

function Recipes() {
  const tags = ["breakfast", "lunch", "dinner", "snack", "dessert", "beverage"];
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const { loading, error, data, refetch } = useQuery(FILTER_RECIPES_QUERY, {
    variables: {
      category: selectedCategory,
    },
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let target = e.target as HTMLButtonElement;
    let category = target.innerText;
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
    <>
      <section className="border-black main-container-recipes">
        <h1 className="jua text-3xl">Explore some of our favorite recipes</h1>
        <p className="red">filter by</p>
        <ul className="filter-container-recipes">
          {tags.map((tag) => (
            <li key={tag}>
              <button
                className={tag === selectedCategory ? 
                  "btn text-btn btn-yellow blue-drop-shadow" : 
                  "btn text-btn btn-yellow hover-blue-drop-shadow"
                }
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
    </>
  );
}

export default Recipes;
