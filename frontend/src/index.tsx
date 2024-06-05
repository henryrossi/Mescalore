import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Mescolare from "./Mescolare";
import AboutUs from "./routes/AboutUs";
import Home from "./routes/Home";
import ErrorPage from "./routes/ErrorPage";
import Recipes, { loader as RecipesLoader } from "./routes/Recipes";
import Recipe, {loader as RecipeLoader} from "./routes/Recipe";
import CreateRecipe from "./routes/CreateRecipe";
import EditRecipe from "./routes/EditRecipe";
import Search from "./routes/Search";
import ActivateEmail from "./routes/ActivateEmail";
import { SignUp, SignIn } from "./routes/UserAuth";
import Profile, { loader as ProfileLoader } from "./routes/Profile";

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
          path: "/profile",
          element: <Profile />,
          loader: ProfileLoader
        }
      ]
    }]
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
