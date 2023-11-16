import { React, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AutosizeInput from "react-18-input-autosize";
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

  /* Page rendering */

  if (error) {
    console.log(error.message);
    return "recipe not found";
  }

  if (!localStorage.getItem("token")) {
    return <Unavailable />;
  }

  const autosizeInputStyle = {
    minWidth: 200,
    maxWidth: 400,
    backgroundColor: "#f9f9f9",
    border: "1px solid #bababa",
    borderRadius: 10,
    height: 36,
    marginTop: 20,
    marginRight: 20,
    paddingLeft: 10,
  };

  return (
    <div id="fullpage">
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <form className="recipe-editor" onSubmit={onSubmit}>
            <h1>Recipe Editor</h1>
            <label>
              Name
              <input
                type="text"
                value={recipeData.name}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "name",
                  })
                }
              />
            </label>
            <label className="autosize-input-label">
              Servings
              <AutosizeInput
                value={recipeData.servings}
                style={{ display: "block" }}
                inputStyle={autosizeInputStyle}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "servings",
                  })
                }
              />
            </label>
            <label className="autosize-input-label">
              Minutes
              <AutosizeInput
                value={recipeData.time}
                style={{ display: "block" }}
                inputStyle={autosizeInputStyle}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "time",
                  })
                }
              />
            </label>
            <ul>
              {categoryChocies.map((category) => (
                <li key={category} className="tag">
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
            <label>
              Description
              <textarea
                defaultValue={recipeData.description}
                onChange={(e) =>
                  dispatch({
                    type: "changeInput",
                    value: e.target.value,
                    variable: "description",
                  })
                }
              />
            </label>
            {recipeData.base64picture ? (
              <img
                src={
                  "data:image/jpeg;charset=utf-8;base64," +
                  atob(recipeData.base64picture)
                }
                alt=""
              />
            ) : (
              <div className="no-picture"></div>
            )}
            <input
              type="file"
              onChange={(e) =>
                dispatch({
                  type: "changeInput",
                  variable: "picture",
                  value: e.target.files[0],
                })
              }
            />
            <h2>Ingredients</h2>
            <p>
              Ingredients are divided into a measurement section and the
              ingredient themselves. For example, 2 Tbsp butter should be
              divided into 2 Tbsp, the measurement, and butter, the ingredient.
              The measurement section may be left blank.
            </p>
            <ul>
              {recipeData.ingredients.map((object, index) => (
                <li key={index}>
                  <AutosizeInput
                    value={object.measurement}
                    inputStyle={autosizeInputStyle}
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
                  <AutosizeInput
                    value={object.ingredient}
                    inputStyle={autosizeInputStyle}
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
                    className="button-icon delete-ingredient-icon"
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
              className="button-icon add-icon"
            >
              <IconPencilPlus />
            </button>
            <h2>Instructions</h2>
            <ol>
              {recipeData.instructions.map((instructions, index) => (
                <li key={index}>
                  <textarea
                    defaultValue={instructions}
                    onChange={(e) =>
                      dispatch({
                        type: "changeInstruction",
                        instruction: e.target.value,
                        index: index,
                      })
                    }
                  />
                  <button
                    className="button-icon delete-instruction-icon"
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
              className="button-icon add-icon"
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "addInstruction" });
              }}
            >
              <IconPencilPlus />
            </button>
            <button type="submit" className="submit-recipe-button">
              Update Recipe
            </button>
            <button onClick={handleDelete} className="delete-recipe-button">
              Delete Recipe
            </button>
          </form>
        </>
      )}
      <Footer />
    </div>
  );
}
