import * as React from "react";
import Unavailable from "../components/Unavailable";
import "./RecipeEditor.css";
import { RecipeEditorData } from "../types";
import authContext from "../authContext";
import Modal from "./Modal";
import "react-image-crop/dist/ReactCrop.css";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import type { XYCoord } from "dnd-core";
import {
  IconTrashX,
  IconPencilPlus,
  IconGripVertical,
} from "@tabler/icons-react";

const ItemTypes = {
  SECTION: "section",
  INGREDIENT: "ingredient",
  INSTRUCTION: "instruction",
};

function generateRandomNumber() {
  return Math.random() * 1000000000;
}

function generateId(recipeData: RecipeEditorData) {
  let id = generateRandomNumber();
  while (
    recipeData.instructions.some((i) => i.id === id) ||
    recipeData.ingredientSections.some((i) => i.id === id) ||
    recipeData.ingredientSections.some((s) =>
      s.ingredients.some((i) => i.id === id),
    )
  ) {
    id = generateRandomNumber();
  }
  return id;
}

export default function RecipeEditor({
  recipeData,
  setRecipeData,
  onSubmit,
  handleDelete,
}: {
  recipeData: RecipeEditorData;
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeEditorData>>;
  onSubmit: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  handleDelete: (() => void) | null;
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
      categories.push({ name: category });
      setRecipeData({ ...recipeData, categories: categories });
      return;
    }
    const index = categories.indexOf({ name: category });
    if (index !== -1) {
      categories.splice(index, 1);
      setRecipeData({ ...recipeData, categories: categories });
    }
  };

  const handleAddNewSection = () => {
    let sections = [
      ...recipeData.ingredientSections,
      {
        id: generateId(recipeData),
        name: "",
        ingredients: [
          {
            id: generateId(recipeData),
            measurement: "",
            ingredient: { name: "" },
          },
        ],
      },
    ];
    setRecipeData({ ...recipeData, ingredientSections: sections });
  };

  const handleChangeSectionName = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentSection: number,
  ) => {
    let sections = [...recipeData.ingredientSections];
    sections[currentSection].name = e.target.value;
    setRecipeData({ ...recipeData, ingredientSections: [...sections] });
  };

  const handleDeleteSection = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    currentSection: number,
  ) => {
    let sections = [...recipeData.ingredientSections];
    sections.splice(currentSection, 1);
    setRecipeData({ ...recipeData, ingredientSections: sections });
  };

  const moveInstructions = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setRecipeData((recipe) => {
        const instructions = [...recipe.instructions];
        const draggingInstruction = instructions[dragIndex];
        instructions.splice(dragIndex, 1);
        instructions.splice(hoverIndex, 0, draggingInstruction);
        return { ...recipe, instructions: instructions };
      });
    },
    [],
  );

  const moveSection = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setRecipeData((recipe) => {
        const sections = [...recipe.ingredientSections];
        const draggingSection = sections[dragIndex];
        sections.splice(dragIndex, 1);
        sections.splice(hoverIndex, 0, draggingSection);
        return { ...recipe, ingredientSections: sections };
      });
    },
    [],
  );

  const moveIngredient = React.useCallback(
    (
      dragIngredientIndex: number,
      dragSectionIndex: number,
      hoverIngredientIndex: number,
      hoverSectionIndex: number,
    ) => {
      if (dragSectionIndex !== hoverSectionIndex) {
        return;
      }

      setRecipeData((recipe) => {
        let sections = [...recipe.ingredientSections];
        const dragSection = sections[dragSectionIndex];
        const draggingIngredient = dragSection.ingredients[dragIngredientIndex];
        dragSection.ingredients.splice(dragIngredientIndex, 1);
        dragSection.ingredients.splice(
          hoverIngredientIndex,
          0,
          draggingIngredient,
        );
        sections[dragSectionIndex] = dragSection;
        return { ...recipe, ingredientSections: sections };
      });
    },
    [],
  );

  return (
    <div className="recipe-editor-container bg-grey border-grey">
      <h1 className="jua red text-4xl">
        {handleDelete ? "Edit this recipe" : "Create a new recipe"}
      </h1>
      <form>
        <div>
          <label htmlFor="name_input">Enter the recipe name.</label>
          <input
            type="text"
            id="name_input"
            className="border-grey"
            value={recipeData.name}
            onChange={(e) =>
              setRecipeData({ ...recipeData, name: e.target.value })
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
              setRecipeData({ ...recipeData, servings: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="time_input">
            Enter the number of minutes needed to prepare.
          </label>
          <input
            type="text"
            id="time_input"
            className="border-grey"
            value={recipeData.time}
            onChange={(e) =>
              setRecipeData({ ...recipeData, time: e.target.value })
            }
          />
        </div>
        <fieldset className="categories-editor">
          <legend>Choose what categories this recipe falls into.</legend>
          {categoryChocies.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                className="border-grey"
                value={category}
                onChange={handleCategoryChange}
              />
              {category}
            </label>
          ))}
        </fieldset>
        <div>
          <label htmlFor="desc_input">Recipe Description</label>
          <textarea
            id="desc_input"
            className="border-grey"
            defaultValue={recipeData.description}
            onChange={(e) =>
              setRecipeData({ ...recipeData, description: e.target.value })
            }
          />
        </div>
        <div>
          <button
            type="button"
            className="btn black btn-white text-btn picture-button-editor"
            onClick={() => setModalOpen(true)}
          >
            Upload a photo
          </button>
          {recipeData.picture ? (
            <>
              <button
                type="button"
                className="btn btn-red white text-btn picture-button-editor"
                onClick={() => setRecipeData({ ...recipeData, picture: null })}
              >
                Discard current upload
              </button>
              <img src={URL.createObjectURL(recipeData.picture)} alt="" />
            </>
          ) : recipeData.imageURL ? (
            <img src={recipeData.imageURL} alt="" />
          ) : (
            <div className="no-image bg-white border-grey">
              <p className="red">no image</p>
            </div>
          )}
          {modalOpen && (
            <Modal
              closeModal={() => setModalOpen(false)}
              recipeData={recipeData}
              setRecipeData={setRecipeData}
            />
          )}
        </div>
        <fieldset>
          <legend>Ingredients</legend>
          <p>
            Ingredients are divided into a measurement section and the
            ingredient themselves. For example, "2 Tbsp butter" should be
            divided into "2 Tbsp", the measurement, and "butter", the
            ingredient. The measurement section may be left blank.
          </p>
          <ul className="flex-col gap-1rem">
            <div className="flex gap-1rem">
              <span className="text-base">Add a new ingredient section</span>
              <button
                type="button"
                className="bg-grey no-border"
                onClick={handleAddNewSection}
              >
                <IconPencilPlus size={"1.5rem"} className="black" />
              </button>
            </div>
            {recipeData.ingredientSections.map((section, currentSection) => (
              <DndListItem
                key={section.id}
                type={ItemTypes.SECTION}
                index={currentSection}
                moveListItem={moveSection}
              >
                <p>Ingredient Section Name</p>
                <div className="section-name-editor flex gap-1rem">
                  <IconGripVertical
                    className="grip-icon-editor"
                    size={"1.5rem"}
                  />
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
                    <IconTrashX size={"1.5rem"} className="black" />
                  </button>
                </div>
                <ul className="list-container-editor ingr-container-editor">
                  {section.ingredients.map((object, index) => (
                    <DndListItem
                      key={object.id}
                      type={ItemTypes.INGREDIENT}
                      index={index}
                      moveListItem={moveIngredient}
                      sectionIndex={currentSection}
                    >
                      <IconGripVertical
                        className="grip-icon-editor"
                        size={"1.5rem"}
                      />
                      <input
                        type="text"
                        className="border-grey"
                        value={object.measurement}
                        onChange={(e) => {
                          let sections = [...recipeData.ingredientSections];
                          let ingredients = [...section.ingredients];
                          ingredients[index] = {
                            id: object.id,
                            measurement: e.target.value,
                            ingredient: object.ingredient,
                          };
                          sections[currentSection].ingredients = ingredients;
                          setRecipeData({
                            ...recipeData,
                            ingredientSections: [...sections],
                          });
                        }}
                      />
                      <input
                        type="text"
                        className="border-grey"
                        value={object.ingredient.name}
                        onChange={(e) => {
                          let sections = [...recipeData.ingredientSections];
                          let ingredients = [...section.ingredients];
                          ingredients[index] = {
                            id: object.id,
                            measurement: object.measurement,
                            ingredient: { name: e.target.value },
                          };
                          sections[currentSection].ingredients = ingredients;
                          setRecipeData({
                            ...recipeData,
                            ingredientSections: [...sections],
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="bg-grey no-border"
                        onClick={() => {
                          let sections = [...recipeData.ingredientSections];
                          const ingredients = [...section.ingredients];
                          ingredients.splice(index, 1);
                          sections[currentSection].ingredients = ingredients;
                          setRecipeData({
                            ...recipeData,
                            ingredientSections: [...sections],
                          });
                        }}
                      >
                        <IconTrashX size={"1.5rem"} className="black" />
                      </button>
                    </DndListItem>
                  ))}
                </ul>
                <button
                  type="button"
                  className="bg-grey no-border add-item-button-editor"
                  onClick={() => {
                    let sections = [...recipeData.ingredientSections];
                    sections[currentSection].ingredients = [
                      ...section.ingredients,
                      {
                        id: generateId(recipeData),
                        ingredient: { name: "" },
                        measurement: "",
                      },
                    ];
                    setRecipeData({
                      ...recipeData,
                      ingredientSections: [...sections],
                    });
                  }}
                >
                  <IconPencilPlus size={"1.5rem"} className="black" />
                </button>
              </DndListItem>
            ))}
          </ul>
        </fieldset>
        <fieldset>
          <legend>Instructions</legend>
          <ol className="list-container-editor">
            {recipeData.instructions.map((instruction, index) => (
              <DndListItem
                key={instruction.id}
                type={ItemTypes.INSTRUCTION}
                index={index}
                moveListItem={moveInstructions}
              >
                <IconGripVertical
                  className="grip-icon-editor"
                  size={"1.5rem"}
                />
                <textarea
                  className="border-grey"
                  value={instruction.text}
                  onChange={(e) => {
                    let instructions = [...recipeData.instructions];
                    instructions[index].text = e.target.value;
                    setRecipeData({
                      ...recipeData,
                      instructions: instructions,
                    });
                  }}
                />
                <button
                  type="button"
                  className="bg-grey no-border"
                  onClick={() => {
                    const instructions = [...recipeData.instructions];
                    instructions.splice(index, 1);
                    setRecipeData({
                      ...recipeData,
                      instructions: instructions,
                    });
                  }}
                >
                  <IconTrashX size={"1.5rem"} className="black" />
                </button>
              </DndListItem>
            ))}
          </ol>
          <button
            type="button"
            className="bg-grey no-border add-item-button-editor"
            onClick={() => {
              setRecipeData({
                ...recipeData,
                instructions: [
                  ...recipeData.instructions,
                  { id: generateId(recipeData), text: "" },
                ],
              });
            }}
          >
            <IconPencilPlus size={"1.5rem"} className="black" />
          </button>
        </fieldset>
        <div>
          <button className="btn black btn-white" onClick={onSubmit}>
            {handleDelete ? "Update Recipe" : "Create Recipe"}
          </button>
        </div>
      </form>

      {handleDelete && (
        <button onClick={handleDelete}>Permanently Delete Recipe</button>
      )}
    </div>
  );
}

function DndListItem({
  type,
  index,
  moveListItem,
  children,
  sectionIndex,
}: {
  children: React.ReactNode;
  type: string;
  index: number;
  moveListItem: any;
  sectionIndex?: number;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const [{ handlerId }, drop] = useDrop(
    () => ({
      accept: type,
      collect: (monitor: DropTargetMonitor) => {
        return { handlerId: monitor.getHandlerId() };
      },
      hover: (
        item: { type: string; index: number; sectionIndex?: number },
        monitor,
      ) => {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) {
          return;
        }

        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        if (type === ItemTypes.INGREDIENT) {
          moveListItem(dragIndex, item.sectionIndex, hoverIndex, sectionIndex);
        } else {
          moveListItem(dragIndex, hoverIndex);
        }

        item.index = hoverIndex;
      },
    }),
    [type, index, sectionIndex],
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: type,
      item: () => {
        return { type, index, sectionIndex };
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [type, index, sectionIndex],
  );

  drag(drop(ref));
  return (
    <li
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
    >
      {children}
    </li>
  );
}
