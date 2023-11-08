import { React, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { IconTrashX, IconPencilPlus } from "@tabler/icons-react";
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

  const updateInputWidth = (event) => {
    const span = document.querySelector("span.span-for-auto-expanding-input");
    span.textContent = event.target.value;
    event.target.style.width = span.offsetWidth + "px";
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
            <span className="span-for-auto-expanding-input"></span>
            <div className="recipe-info-editor">
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
              <ul>
                <li>
                  <span>
                    <input
                      type="text"
                      value={recipeData.servings}
                      onChange={(e) => {
                        updateInputWidth(e);
                        dispatch({
                          type: "changeInput",
                          value: e.target.value,
                          variable: "servings",
                        });
                      }}
                    />{" "}
                    servings
                  </span>
                </li>
                <li>
                  <span>
                    <input
                      type="text"
                      value={recipeData.time}
                      onChange={(e) =>
                        dispatch({
                          type: "changeInput",
                          value: e.target.value,
                          variable: "time",
                        })
                      }
                    />{" "}
                    minutes
                  </span>
                </li>
                {categoryChocies.map((category) => (
                  <li key={category}>
                    <button
                      className={
                        recipeData.categories.includes(category)
                          ? ""
                          : "unselected"
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
              <textarea
                value={recipeData.description}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "description",
                  })
                }
              />
              {recipeData.base64picture ? (
                <img
                  src={
                    "data:image/jpeg;charset=utf-8;base64," +
                    atob(recipeData.base64picture)
                  }
                  alt=""
                />
              ) : (
                <div className="noPicture"></div>
              )}
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
            <div className="recipe-method-editor">
              <div className="ingredients">
                <h2>Ingredients</h2>
                <ul>
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
                        className="buttonIcon"
                      >
                        <IconTrashX />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "addIngredient" });
                  }}
                  className="buttonIcon"
                >
                  <IconPencilPlus />
                </button>
              </div>
              <div className="instructions">
                <h2>Instructions</h2>
                <ol>
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
                        className="buttonIcon"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch({
                            type: "removeListItem",
                            variable: "instructions",
                            index: index,
                          });
                        }}
                      >
                        <IconTrashX />
                      </button>
                    </li>
                  ))}
                </ol>
                <button
                  className="buttonIcon"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "addInstruction" });
                  }}
                >
                  <IconPencilPlus />
                </button>
              </div>
              <button className="submit button" type="submit">
                Update Recipe
              </button>
              <button className="deleteRecipeButton" onClick={handleDelete}>
                Delete Recipe
              </button>
            </div>
          </form>
        </>
      )}
      <Footer />
    </div>
  );
}
