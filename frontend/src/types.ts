export interface RecipeData {
  id: string,
  name: string,
  description: string,
  servings: string,
  time: string,
  categories: string[],
  imageURL: string | null,
  ingredientSections: ingredientSections[]
  instructions: string,
  favorite: boolean,
};

export interface ingredientSections {
  name: string,
  ingredients: IngredientList[]
}

export interface IngredientList {
  ingredient: string,
  measurement: string,
};
  
export interface RecipeEditorData {
  id: string,
  name: string,
  description: string,
  servings: string,
  time: string,
  categories: string[],
  picture: Blob | null,
  imageURL: string | null,
  ingredientSections: ingredientSections[]
  instructions: string[],
};

export interface RecipeGraphQLReturn {
  id: string,
  name: string,
  imageURL: string | null,
  description: string,
  time: string,
  servings: string,
  instructions: string,
  category: CategoryGraphQLReturn[]
  ingredientSections: ingredientSectionsGraphQLReturn[]
  favorite: boolean
}

interface CategoryGraphQLReturn {
  name: string,
}

interface ingredientSectionsGraphQLReturn {
  name: string,
  ingredientList: IngredientListGraphQLReturn[]
}

interface IngredientListGraphQLReturn {
  id: string,
  ingredient: IngredientGraphQLReturn
  measurement: string,
}

interface IngredientGraphQLReturn {
  name: string,
}


export interface RecipePreview {
  name: string,
  imageURL: string | null,
  categories: string[],
}

export interface RecipePreviewGraphQLReturn {
  name: string,
  imageURL: string | null,
  category: { name: string}[],
}

export interface UserAuth {
  authenticated: boolean,
  editorPermissions: boolean,
}
