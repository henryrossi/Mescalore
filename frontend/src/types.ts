export interface RecipeData {
  id: string,
  name: string,
  description: string,
  servings: string,
  time: string,
  categories: Category[],
  imageURL: string | null,
  ingredientSections: ingredientSections[]
  instructions: string,
  favorite: boolean,
};

export interface RecipePreview {
  name: string,
  imageURL: string | null,
  categories: Category[],
}

export interface Category {
  name: string,
}

export interface ingredientSections {
  name: string,
  ingredients: IngredientList[]
}

export interface IngredientList {
  ingredient: Ingredient,
  measurement: string,
};

export interface Ingredient {
  name: string,
}

export interface RecipeEditorData {
  id: string,
  name: string,
  description: string,
  servings: string,
  time: string,
  categories: Category[],
  picture: Blob | null,
  imageURL: string | null,
  ingredientSections: IngredientSectionsEditor[]
  instructions: InstructionsEditor[],
};

export interface IngredientSectionsEditor {
  id: number
  name: string,
  ingredients: IngredientListEditor[]
}

export interface IngredientListEditor {
  id: number,
  ingredient: Ingredient,
  measurement: string,
};

export interface InstructionsEditor {
  id: number,
  text: string,
}

export interface UserAuth {
  authenticated: boolean,
  editorPermissions: boolean,
}
