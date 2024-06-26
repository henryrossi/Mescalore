import * as React from "react";
import Unavailable from "../components/Unavailable";
import "./RecipeEditor.css";
import { RecipeEditorData } from "../types";
import authContext from "../authContext";
import Modal from "./Modal";
import 'react-image-crop/dist/ReactCrop.css'
import { IconTrashX, IconPencilPlus } from "@tabler/icons-react";

export default function RecipeEditor({
  recipeData,
  setRecipeData,
  onSubmit,
  handleDelete,
} : { 
  recipeData: RecipeEditorData, 
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeEditorData>>, 
  onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
  handleDelete: (() => void) | null
}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { userAuth } = React.useContext(authContext);

  if (!userAuth.authenticated || !userAuth.editorPermissions) {
    return <Unavailable />;
  }

  const categoryChocies = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "dessert",
    "beverage",
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let categories = [...recipeData.categories];
    const category = e.target.value;
    if (e.target.checked) {
      categories.push(category);
      setRecipeData({...recipeData, categories: categories});
      return;
    }
    const index = categories.indexOf(category);
    if (index !== -1) {
      categories.splice(index, 1);
      setRecipeData({...recipeData, categories: categories});
    }
  }

  const handleAddNewSection = () => {
    let sections = [...recipeData.ingredientSections, {
      name: "",
      ingredients: [{
        measurement: "",
        ingredient: "",
      }],
    }];
    setRecipeData({...recipeData, ingredientSections: sections});
  }

  const handleChangeSectionName = (e: React.ChangeEvent<HTMLInputElement>, 
                                   currentSection: number) => {
    let sections = [...recipeData.ingredientSections];
    sections[currentSection].name = e.target.value;
    setRecipeData({...recipeData, ingredientSections: [...sections]});
  }

  const handleDeleteSection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
                               currentSection: number) => {
    let sections = [...recipeData.ingredientSections]
    sections.splice(currentSection, 1);
    setRecipeData({...recipeData, ingredientSections: sections});
  }

  return (
    <div className="recipe-editor-container bg-grey border-grey">
      <h1 className="jua red text-4xl">{handleDelete ? "Edit this recipe" : "Create a new recipe"}</h1>
      <form>
        <div>
          <label htmlFor="name_input">Enter the recipe name.</label>
          <input
            type="text"
            id="name_input"
            className="border-grey"
            value={recipeData.name}
            onChange={(e) =>
              setRecipeData({...recipeData, name: e.target.value})
            }
          />
        </div>
        <div>
          <label htmlFor="servings_input">How many servings?</label>
          <input
            type="text"
            id="servings_input"
            className="border-grey"
            value={recipeData.servings}
            onChange={(e) =>
              setRecipeData({...recipeData, servings: e.target.value})
            }
          />
        </div>
        <div>
          <label htmlFor="time_input">Enter the number of minutes needed to prepare.</label>
          <input
            type="text"
            id="time_input"
            className="border-grey"
            value={recipeData.time}
            onChange={(e) =>
              setRecipeData({...recipeData, time: e.target.value})
            }
          />
        </div>
        <fieldset className="categories-editor">
          <legend>Choose what categories this recipe falls into.</legend>
          {categoryChocies.map(category => 
            <label key={category}>
              <input 
                type="checkbox" 
                className="border-grey"
                value={category}
                onChange={handleCategoryChange}
              />
              {category}
            </label>
          )}
        </fieldset>
        <div>
          <label htmlFor="desc_input">Recipe Description</label>
          <textarea
            id="desc_input"
            className="border-grey"
            defaultValue={recipeData.description}
            onChange={(e) =>
              setRecipeData({...recipeData, description: e.target.value})
            }
          />
        </div>
        <div>
          <button 
            type="button"
            className="btn btn-white text-btn picture-button-editor" 
            onClick={() => setModalOpen(true)}
          >
            Upload a photo
          </button>
          {recipeData.picture ? (
            <>
              <button
                type="button"
                className="btn btn-red white text-btn picture-button-editor" 
                onClick={() => setRecipeData({...recipeData, picture: null})} 
              >
                Discard current upload
              </button>
              <img src={URL.createObjectURL(recipeData.picture)} alt="" />
            </>
          ) : recipeData.imageURL ? (
            <img
              src={recipeData.imageURL}
              alt=""
            />
          ) : (
            <div className="no-image bg-white border-grey">
              <p className="red">no image</p>
            </div>
          )}
          {modalOpen && <Modal closeModal={() => setModalOpen(false)} recipeData={recipeData} setRecipeData={setRecipeData}/>}
        </div>
        <fieldset>
          <legend>Ingredients</legend> 
          <p>
            Ingredients are divided into a measurement section and the ingredient
            themselves. For example, "2 Tbsp butter" should be divided into "2 Tbsp",
            the measurement, and "butter", the ingredient. The measurement section may
            be left blank.
          </p>
          <ul>
            <div className="flex gap-1rem">
              <span className="text-base">Add a new ingredient section</span>
              <button
                type="button"
                className="bg-grey no-border"
                onClick={handleAddNewSection}
              >
                <IconPencilPlus size={'1.5rem'}/>
              </button>
            </div>
            {recipeData.ingredientSections.map((section, currentSection) => (
              <li key={currentSection}>
                <p>Ingredient Section Name</p>
                <div className="flex gap-1rem">
                  <input
                    type="text"
                    className="border-grey"
                    value={section.name} 
                    onChange={(e) => handleChangeSectionName(e, currentSection)}
                  />
                  <button
                    type="button"
                    className="bg-grey no-border"
                    onClick={(e) => handleDeleteSection(e, currentSection)}
                  >
                    <IconTrashX size={'1.5rem'}/>
                  </button>
                </div>
                <ul className="list-container-editor">
                  {section.ingredients.map((object, index) => (
                    <li key={index}>
                      <input
                        type="text"
                        className="border-grey"
                        value={object.measurement}
                        onChange={(e) => {
                          let sections = [...recipeData.ingredientSections]
                          let ingredients = [...section.ingredients];
                          ingredients[index] = {
                            measurement: e.target.value,
                            ingredient: object.ingredient,
                          };
                          sections[currentSection].ingredients = ingredients;
                          setRecipeData({
                            ...recipeData, 
                            ingredientSections: [
                              ...sections
                            ],
                          });
                        }}
                      />
                      <input
                        type="text"
                        className="border-grey"
                        value={object.ingredient}
                        onChange={(e) => {
                          let sections = [...recipeData.ingredientSections]
                          let ingredients = [...section.ingredients];
                          ingredients[index] = {
                            measurement: object.measurement,
                            ingredient: e.target.value,
                          };
                          sections[currentSection].ingredients = ingredients
                          setRecipeData({
                            ...recipeData, 
                            ingredientSections: [
                              ...sections
                            ],
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="bg-grey no-border"
                        onClick={() => {
                          let sections = [...recipeData.ingredientSections]
                          const ingredients = [...section.ingredients];
                          ingredients.splice(index, 1);
                          sections[currentSection].ingredients = ingredients
                          setRecipeData({...recipeData, ingredientSections: [
                            ...sections
                          ],});
                        }}
                      >
                        <IconTrashX size={'1.5rem'}/>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="bg-grey no-border add-item-button-editor"
                  onClick={() => {
                    let sections = [...recipeData.ingredientSections]
                    sections[currentSection].ingredients  = [
                      ...section.ingredients, {ingredient: "", measurement: ""}
                    ]
                    setRecipeData({...recipeData,
                      ingredientSections: [
                        ...sections
                      ],
                    });
                  }}
                >
                  <IconPencilPlus size={'1.5rem'}/>
                </button>
            </li>))}
          </ul>
        </fieldset>
        <fieldset>
          <legend>Instructions</legend>
          <ol className="list-container-editor">
            {recipeData.instructions.map((instructions, index) => (
              <li key={index}>
                <textarea
                  className="border-grey"
                  defaultValue={instructions}
                  onChange={(e) => {
                    let instructions = [...recipeData.instructions];
                    instructions[index] = e.target.value;
                    setRecipeData({...recipeData, instructions: instructions});
                  }}
                />
                <button
                  type="button"
                  className="bg-grey no-border"
                  onClick={() => {
                    const instructions = [...recipeData.instructions];
                    instructions.splice(index, 1);
                    setRecipeData({...recipeData, instructions: instructions});
                  }}
                >
                  <IconTrashX size={'1.5rem'}/>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="bg-grey no-border add-item-button-editor"
            onClick={() => {
              setRecipeData({...recipeData, instructions: [...recipeData.instructions, ""]});
            }}
          >
            <IconPencilPlus size={'1.5rem'}/>
          </button>
        </fieldset>
        <div>
          <button className="btn btn-white" onClick={onSubmit}>
            {handleDelete ? "Update Recipe" : "Create Recipe"}
          </button>
        </div>
      </form>

      {handleDelete && (
        <button onClick={handleDelete}>
          Permanently Delete Recipe
        </button>
      )}
    </div>
  );
}
