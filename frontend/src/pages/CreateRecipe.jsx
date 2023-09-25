import { React, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CREATE_RECIPE_MUTATION } from "../graphQL.js";
import recipeStateReducer from "../recipeStateRecuder.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Unavailable from "../components/Unavailable";
import "./CreateRecipe.css";

const categoryChocies = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
  "beverage",
  "other",
];

function CreateRecipe() {
  const navigate = useNavigate();
  const [recipeData, dispatch] = useReducer(recipeStateReducer, {
    name: "",
    description: "",
    time: "",
    servings: "",
    categories: [],
    picture: null,
    ingredients: [],
    instructions: [],
  });

  /* Apollo Queries and Mutations */

  const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION, {
    onCompleted: (data) => {
      if (!data.createRecipe.success) {
        window.alert("Failed to create recipe");
        return;
      }
      navigate("/");
    },
    onError: (error) => {
      window.alert("Error: " + error.message);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createRecipe({
      variables: {
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

  /* Page rendering */

  if (!localStorage.getItem("token")) {
    return <Unavailable />;
  }

  return (
    <div id="fullpage">
      <Navbar />
      <form onSubmit={onSubmit} className="creator">
        <input
          type="text"
          id="name"
          className="name"
          placeholder="Reicpe Name"
          value={recipeData.name}
          onChange={(e) =>
            dispatch({
              type: "changeInput",
              variable: "name",
              value: e.target.value,
            })
          }
        />
        <div className="info">
          <input
            type="text"
            id="servings"
            className="servings"
            placeholder="0"
            value={recipeData.servings}
            onChange={(e) =>
              dispatch({
                type: "changeInput",
                variable: "servings",
                value: e.target.value,
              })
            }
          />
          <p className="servings text">servings</p>
          <input
            type="text"
            id="time"
            className="time"
            placeholder="0"
            value={recipeData.time}
            onChange={(e) =>
              dispatch({
                type: "changeInput",
                variable: "time",
                value: e.target.value,
              })
            }
          />
          <p className="time text">minutes</p>
          <textarea
            id="description"
            className="description"
            placeholder="Description"
            value={recipeData.description}
            onChange={(e) =>
              dispatch({
                type: "changeInput",
                variable: "description",
                value: e.target.value,
              })
            }
          />
          <ul className="tagList">
            {categoryChocies.map((category, index) => (
              <li className="category" key={category}>
                <button
                  className={
                    recipeData.categories.includes(categoryChocies[index])
                      ? "tag selected"
                      : "tag unselected"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "changeCategories", category: category });
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
                name: "picture",
                value: e.target.files[0],
              })
            }
          />
          {recipeData.picture && (
            <img
              alt=""
              className="photo"
              src={URL.createObjectURL(recipeData.picture)}
            />
          )}
        </div>
        <ul className="ingredients">
          <p>Ingredients</p>
          {recipeData.ingredients.map((object, index) => (
            <li key={index}>
              <input
                type="text"
                className="measurement"
                placeholder="mesaurement"
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
                placeholder="ingredient"
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
                className="button"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({
                    type: "removeListItem",
                    variable: "ingredients",
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
              dispatch({
                type: "addIngredient",
              });
            }}
          >
            Add Ingredient
          </button>
        </ul>
        <ul className="instructions">
          <p>Instructions</p>
          {recipeData.instructions.map((instruction, index) => (
            <li key={index}>
              <input
                type="text"
                placeholder="Type step here"
                value={instruction}
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
          Create Recipe
        </button>
      </form>
      <Footer />
    </div>
  );
}

export default CreateRecipe;
