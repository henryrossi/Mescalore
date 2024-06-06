export interface RecipeData {
  id: string,
  name: string,
  description: string,
  servings: string,
  time: string,
  category: { name: string }[],
  imageURL: string | null,
  ingredientList: IngredientList[],
  instructions: string,
  favorite: boolean,
};
  
export interface RecipeData2 {
  name: string,
  description: string,
  servings: string,
  time: string,
  categories: string[],
  picture: Blob | null,
  imageURL: string | null,
  ingredients: { ingredient: string, measurement: string }[],
  instructions: string[],
};

export interface RecipeReturnType {
  id: string,
  name: string,
  imageURL: string,
  description: string,
  time: string,
  servings: string,
  instructions: string,
  category: CategoryReturnType[]
  ingredientList: IngredientListReturnType[]
}

interface CategoryReturnType {
  name: string,
}

interface IngredientListReturnType {
  id: string,
  ingredient: IngredientReturnType
  measurement: string,
}

interface IngredientReturnType {
  name: string,
}

export interface IngredientList {
  ingredient: { name: string },
  measurement: string,
};

export interface RecipePreview {
  name: string,
  imageURL: string,
  category: {
    name: string,
  }[],
}

export interface UserAuth {
  authenticated: boolean,
  editorPermissions: boolean,
}