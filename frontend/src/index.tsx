import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Mescolare from "./Mescolare";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Recipes from "./pages/Recipes";
import Recipe from "./pages/Recipe";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ActivateEmail from "./pages/ActivateEmail";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getRecipeByName: {
            keyArgs: ["name"],
          },
          searchRecipes: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ["searchText"],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  uri: process.env.REACT_APP_BACKEND_URI,
  headers: {
    authorization: localStorage.getItem("token") ? 
                   `JWT ${localStorage.getItem("token")}` : "",
  },
  connectToDevTools: true,
});

const tokenTime = localStorage.getItem("tokenTime");
if (tokenTime != null && Date.now() - parseInt(tokenTime, 10) > 86400000) {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenTime");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mescolare />,
    errorElement: <ErrorPage />,
    children: [{
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "/about",
          element: <AboutUs />
        },
        {
          path: "/recipes",
          element: <Recipes />
        },
        {
          path: "/create",
          element: <CreateRecipe />
        },
        {
          path: "/:recipeName",
          element: <Recipe />
        },
        {
          path: "/edit/:recipeName",
          element: <EditRecipe />
        },
        {
          path: "/search",
          element: <Search />
        },
        {
          path: "/sign-in",
          element: <SignIn />
        },
        {
          path: "/sign-up",
          element: <SignUp />
        }, 
        {
          path: "/activate/:token",
          element: <ActivateEmail />
        }
      ]
    }]
  }
]);

const entry = document.getElementById("root");
if (entry == null) {
  console.log("Err:  Can't find react entry point");
} else {
  const root = ReactDOM.createRoot(entry);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </React.StrictMode>
  );
}
