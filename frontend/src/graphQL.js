import { gql } from "@apollo/client";

// Queries
export const FILTER_RECIPES_QUERY = gql`
  query FilterRecipesQuery($category: String!) {
    getRecipesByCategory(category: $category) {
      name
      base64picture
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
      base64picture
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
      base64picture
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
    $picture: Upload
  ) {
    createRecipe(
      recipeData: {
        name: $name
        categories: $categories
        description: $description
        time: $time
        servings: $servings
        picture: $picture
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
    $picture: Upload
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
        picture: $picture
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
