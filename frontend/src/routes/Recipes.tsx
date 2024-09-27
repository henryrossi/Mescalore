import * as React from "react";
import { useLoaderData } from "react-router-dom";
import { gql } from "@apollo/client";
import client from "../client";
import { RecipePreview, RecipePreviewGraphQLReturn } from "../types";
import RecipeList from "../components/RecipeList";
import "./Recipes.css";

const FILTER_RECIPES_QUERY = gql`
  query FilterRecipesQuery($category: String!) {
    getRecipesByCategory(category: $category) {
      name
      imageURL
      category {
        name
      }
    }
  }
`;

function decomposeGraphQLData(
  gqlData: RecipePreviewGraphQLReturn[],
): RecipePreview[] {
  return gqlData.map((preview) => ({
    ...preview,
    categories: preview.category.map((obj) => obj.name),
  }));
}

export async function loader() {
  const result = await client.query({
    query: FILTER_RECIPES_QUERY,
    variables: {
      category: "",
    },
  });

  return decomposeGraphQLData(result.data.getRecipesByCategory);
}

export default function Recipes() {
  const tags = ["breakfast", "lunch", "dinner", "snack", "dessert", "beverage"];
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const recipePreviews = useLoaderData() as RecipePreview[];
  const [filteredPreviews, setFilteredPreviews] =
    React.useState(recipePreviews);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let target = e.target as HTMLButtonElement;
    let category = target.innerText;
    const previews = [...recipePreviews];
    if (category === selectedCategory) {
      setSelectedCategory("");
      setFilteredPreviews(previews);
      return;
    }
    setSelectedCategory(category);
    setFilteredPreviews(
      previews.filter(
        (recipe) =>
          recipe.categories.filter((cat) => cat.toLowerCase() === category)
            .length > 0,
      ),
    );
  };

  return (
    <>
      <section className="border-black main-container__recipes">
        <div className="orange-banner"></div>
        <div className="flex-col gap-1rem padding-1rem">
          <h1 className="jua text-3xl">Explore some of our favorite recipes</h1>
          <span className="red">filter by</span>
          <ul className="filter-container__recipes">
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  className={
                    tag === selectedCategory
                      ? "btn black text-btn btn-yellow blue-drop-shadow"
                      : "btn black text-btn btn-yellow hover-blue-drop-shadow"
                  }
                  onClick={handleClick}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <RecipeList recipes={filteredPreviews} />
    </>
  );
}
