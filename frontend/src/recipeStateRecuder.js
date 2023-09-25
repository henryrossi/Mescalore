export default function recipeStateReducer(state, action) {
  switch (action.type) {
    case "changeInput":
      // Defines updating simple text inputs such as recipe name, description,
      // etc, as well as the image upload.
      return {
        ...state,
        [action.variable]: action.value,
      };
    case "changeCategories":
      let categories = [...state.categories];
      if (categories.includes(action.category)) {
        categories.splice(state.categories.indexOf(action.category), 1);
        return {
          ...state,
          categories: categories,
        };
      }
      categories.push(action.category);
      return {
        ...state,
        categories: categories,
      };
    case "changeIngredient":
      let ingredients = [...state.ingredients];
      ingredients[action.index] = action.ingredient;
      return {
        ...state,
        ingredients: ingredients,
      };
    case "changeInstruction":
      let instructions = [...state.instructions];
      instructions[action.index] = action.instruction;
      return {
        ...state,
        instructions: instructions,
      };
    case "addIngredient":
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          {
            measurement: "",
            ingredient: "",
          },
        ],
      };
    case "addInstruction":
      return {
        ...state,
        instructions: [...state.instructions, ""],
      };
    case "removeListItem":
      return {
        ...state,
        [action.variable]: state[action.variable].toSpliced(action.index, 1),
      };
    case "query":
      // Might want to rename recipe.category to recipe.categories in the backend
      // Also, recipe.time and recipe.servings are orginally ints when returned by the query,
      // may need to be cast to str explicitly althought it's done implicity on user input currently
      return {
        ...action.recipe,
        categories: action.recipe.category.map((categories) =>
          categories.name.toLowerCase()
        ),
        picture: null,
        ingredients: action.recipe.ingredientList.map((object) => ({
          measurement: object.measurement,
          ingredient: object.ingredient.name,
        })),
        instructions: action.recipe.instructions.split("\r"),
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}
