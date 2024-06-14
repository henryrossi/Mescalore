export interface RecipeData {
  id: string,
  name: string,
  description: string,
  servings: string,
  time: string,
  category: { name: string }[],
  imageURL: string | null,
  ingredientSections: ingredientSections[]
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
  ingredientSections: {
    name: string, 
    ingredients: { 
      ingredient: string, 
      measurement: string 
    }[],
  }[],
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
  ingredientSections: {
    name: string,
    ingredientList: IngredientListReturnType[]
  }[]
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

interface ingredientSections {
  name: string,
  ingredientList: IngredientList[]
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