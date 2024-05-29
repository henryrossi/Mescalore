import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Mescolare from "./Mescolare";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Recipes, { loader as RecipesLoader } from "./pages/Recipes";
import Recipe, {loader as RecipeLoader} from "./pages/Recipe";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ActivateEmail from "./pages/ActivateEmail";

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
          element: <Recipes />,
          loader: RecipesLoader,
        },
        {
          path: "/create",
          element: <CreateRecipe />
        },
        {
          path: "/:recipeName",
          element: <Recipe />,
          loader: RecipeLoader,
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
        },
      ]
    }]
  }
]);

const entry = document.createElement('div');
entry.id = 'root';
document.body.appendChild(entry);

if (entry == null) {
  console.log("Err:  Can't find react entry point");
} else if (process.env.MODE !== 'production') {
  console.log('You are in development mode!');
  const root = ReactDOM.createRoot(entry);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </React.StrictMode>
  );
} else {
  const root = ReactDOM.createRoot(entry);
  root.render(
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}
