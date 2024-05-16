import { gql } from "@apollo/client";

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
}

// Queries
export const FILTER_RECIPES_QUERY = gql`
  query FilterRecipesQuery($category: String!) {
    getRecipesByCategory(category: $category) {
      name
      imageURL
    }
  }
`;

export const GET_RECIPE_QUERY = gql`
  query recipeQuery($name: String!) {
    getRecipeByName(name: $name) {
      id
      name
      description
      servings
      time
      category {
        name
      }
      imageURL
      ingredientList {
        ingredient {
          name
        }
        measurement
      }
      instructions
    }
  }
`;

export const SEARCH_RECIPES_QUERY = gql`
  query SearchRecipesQuery($searchText: String, $offset: Int, $limit: Int) {
    searchRecipes(searchText: $searchText, offset: $offset, limit: $limit) {
      name
      imageURL
    }
  }
`;

export const GET_NUMBER_OF_RECIPES = gql`
  query NumberOfRecipes {
    getNumberOfRecipes
  }
`;

// Mutations
export const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipe(
    $categories: [String]!
    $description: String!
    $ingredients: [String]!
    $instructions: String!
    $measurements: [String]!
    $name: String!
    $servings: Int!
    $time: Int!
    $imageURL: String
  ) {
    createRecipe(
      recipeData: {
        name: $name
        categories: $categories
        description: $description
        time: $time
        servings: $servings
        imageURL: $imageURL
        measurements: $measurements
        ingredients: $ingredients
        instructions: $instructions
      }
    ) {
      success
    }
  }
`;

export const EDIT_RECIPE_MUTATION = gql`
  mutation editRecipe(
    $categories: [String]!
    $description: String!
    $ingredients: [String]!
    $instructions: String!
    $measurements: [String]!
    $name: String!
    $servings: Int!
    $time: Int!
    $imageURL: String
    $recipeId: ID!
  ) {
    editRecipe(
      recipeId: $recipeId
      recipeData: {
        name: $name
        categories: $categories
        description: $description
        time: $time
        servings: $servings
        imageURL: $imageURL
        measurements: $measurements
        ingredients: $ingredients
        instructions: $instructions
      }
    ) {
      updated
    }
  }
`;

export const DELETE_RECIPE_MUTATION = gql`
  mutation deleteRecipe($recipeId: ID!) {
    deleteRecipe(RecipeID: $recipeId) {
      deleted
    }
  }
`;

export const USER_REGISTRATION = gql`
  mutation userRegistration(
    $email: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    userRegistration(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
      token
    }
  }
`;

// Need to change to allow for login using email or username
export const USER_AUTHENTICATION = gql`
  mutation userAuthentication($username: String!, $password: String!) {
    userAuthentication(username: $username, password: $password) {
      success
      errors
      token
      refreshToken
      user {
        username
      }
    }
  }
`;

export const USER_VERIFICATION = gql`
  mutation userVerification($token: String!) {
    userVerification(token: $token) {
      errors
      success
    }
  }
`;

export const GET_S3_PRESIGNED_URL = gql`
  query S3PresignedUrl {
    getS3PresignedUrl
  }
`;