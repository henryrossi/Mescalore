import { React, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_RECIPE_QUERY,
  EDIT_RECIPE_MUTATION,
  DELETE_RECIPE_MUTATION,
} from "../graphQL.js";
import recipeStateReducer from "../recipeStateRecuder.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Unavailable from "../components/Unavailable";
import "./EditRecipe.css";

const categoryChocies = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
  "beverage",
  "other",
];

export default function EditRecipe() {
  const { recipeName } = useParams();
  const navigate = useNavigate();
  const [recipeData, dispatch] = useReducer(recipeStateReducer, {
    id: 0,
    name: "",
    servings: "",
    time: "",
    description: "",
    categories: [],
    picture: null,
    ingredients: [],
    instructions: [],
  });

  /* Apollo Queries and Mutations */

  const { loading, error } = useQuery(GET_RECIPE_QUERY, {
    variables: {
      name: recipeName,
    },
    onCompleted: (data) => {
      dispatch({ type: "query", recipe: data.getRecipeByName });
    },
  });

  const [updateRecipe] = useMutation(EDIT_RECIPE_MUTATION, {
    onCompleted: (data) => {
      if (!data.editRecipe.updated) {
        window.alert("Recipe failed to update");
        return;
      }
      navigate("/");
    },
    onError: (error) => {
      window.alert("Error: " + error.message);
    },
  });

  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    onCompleted: (data) => {
      if (!data.deleteRecipe.deleted) {
        window.alert("Recipe failed to delete");
        return;
      }
      navigate("/");
    },
    onError: (error) => {
      window.alert("Error: " + error.message);
    },
  });

  /* Logic handling for the form */

  const onSubmit = (event) => {
    event.preventDefault();
    updateRecipe({
      variables: {
        recipeId: recipeData.id,
        name: recipeData.name,
        time: parseInt(recipeData.time),
        servings: parseInt(recipeData.servings),
        description: recipeData.description,
        categories: recipeData.categories,
        picture: recipeData.picture,
        measurements: recipeData.ingredients.map(
          (object) => object.measurement
        ),
        ingredients: recipeData.ingredients.map((object) => object.ingredient),
        instructions: recipeData.instructions.join("\r"),
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe({ variables: { recipeId: recipeData.id } });
    }
  };

  /* Page rendering */

  if (error) {
    console.log(error.message);
    return "recipe not found";
  }

  if (!localStorage.getItem("token")) {
    return <Unavailable />;
  }

  return (
    <div id="fullpage">
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <form className="editor" onSubmit={onSubmit}>
            <input
              type="text"
              className="name"
              value={recipeData.name}
              onChange={(e) =>
                dispatch({
                  type: "changeInput",
                  value: e.target.value,
                  variable: "name",
                })
              }
            />
            <div className="info">
              <input
                type="text"
                className="servings"
                value={recipeData.servings}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "servings",
                  })
                }
              />
              <p className="servings text">servings</p>
              <input
                type="text"
                className="time"
                value={recipeData.time}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "time",
                  })
                }
              />
              <p className="time text">minutes</p>
              <textarea
                type="text"
                className="description"
                value={recipeData.description}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "description",
                  })
                }
              />
              <ul className="tagList">
                {categoryChocies.map((category) => (
                  <li key={category}>
                    <button
                      className={
                        recipeData.categories.includes(category)
                          ? "tag selected"
                          : "tag unselected"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch({
                          type: "changeCategories",
                          category: category,
                        });
                      }}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="file"
                className="upload"
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    variable: "picture",
                    value: e.target.files[0],
                  })
                }
              />
            </div>
            <ul className="ingredients">
              <p>Ingredients</p>
              {recipeData.ingredients.map((object, index) => (
                <li key={index}>
                  <input
                    type="text"
                    className="measurement"
                    value={object.measurement}
                    onChange={(e) =>
                      dispatch({
                        type: "changeIngredient",
                        ingredient: {
                          measurement: e.target.value,
                          ingredient: object.ingredient,
                        },
                        index: index,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={object.ingredient}
                    onChange={(e) =>
                      dispatch({
                        type: "changeIngredient",
                        ingredient: {
                          measurement: object.measurement,
                          ingredient: e.target.value,
                        },
                        index: index,
                      })
                    }
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch({
                        type: "removeListItem",
                        variable: "ingredients",
                        index: index,
                      });
                    }}
                    className="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: "addIngredient" });
                }}
                className="add button"
              >
                Add Ingredient
              </button>
            </ul>
            <ul className="instructions">
              <p>Instructions</p>
              {recipeData.instructions.map((instructions, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) =>
                      dispatch({
                        type: "changeInstruction",
                        instruction: e.target.value,
                        index: index,
                      })
                    }
                  />
                  <button
                    className="button"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch({
                        type: "removeListItem",
                        variable: "instructions",
                        index: index,
                      });
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
              <button
                className="add button"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: "addInstruction" });
                }}
              >
                Add instruction
              </button>
            </ul>
            <button className="submit button" type="submit">
              Update Recipe
            </button>
          </form>
          <button className="deleteRecipeButton" onClick={handleDelete}>
            Delete Recipe
          </button>
        </>
      )}
      <Footer />
    </div>
  );
}
