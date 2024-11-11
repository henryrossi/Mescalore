import * as React from "react";
import * as ReactDOM from "react-dom/client";
import client from "./client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Mescolare from "./Mescolare";
import AboutUs from "./routes/AboutUs";
import Home from "./routes/Home";
import ErrorPage from "./routes/ErrorPage";
import Recipes, { loader as RecipesLoader } from "./routes/Recipes";
import Recipe, { loader as RecipeLoader } from "./routes/Recipe";
import CreateRecipe, {
  loader as CreateRecipeLoader,
} from "./routes/CreateRecipe";
import EditRecipe, { loader as EditRecipeLoader } from "./routes/EditRecipe";
import Search, { loader as SearchLoader } from "./routes/Search";
import ActivateEmail from "./routes/ActivateEmail";
import {
  ForgotPassword,
  PasswordResetEmailSent,
} from "./routes/ForgotPassword";
import ResetPassword from "./routes/ResetPassword";
import { SignUp, SignIn } from "./routes/UserAuth";
import Profile, { loader as ProfileLoader } from "./routes/Profile";
import Unavailable from "./components/Unavailable";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mescolare />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <Unavailable />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "/about",
            element: <AboutUs />,
          },
          {
            path: "/recipes",
            element: <Recipes />,
            loader: RecipesLoader,
          },
          {
            path: "/create",
            element: <CreateRecipe />,
            loader: CreateRecipeLoader,
          },
          {
            path: "/:recipeName",
            element: <Recipe />,
            loader: RecipeLoader,
          },
          {
            path: "/edit/:recipeName",
            element: <EditRecipe />,
            loader: EditRecipeLoader,
          },
          {
            path: "/search",
            element: <Search />,
            loader: SearchLoader,
          },
          {
            path: "/profile",
            element: <Profile />,
            loader: ProfileLoader,
          },
        ],
      },
    ],
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/activate/:token",
    element: <ActivateEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/password-reset-email-sent",
    element: <PasswordResetEmailSent />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
]);

const entry = document.createElement("div");
entry.id = "root";
document.body.appendChild(entry);

if (entry == null) {
  console.log("Err:  Can't find react entry point");
} else if (process.env.MODE !== "production") {
  console.log("You are in development mode!");
  const root = ReactDOM.createRoot(entry);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
} else {
  const root = ReactDOM.createRoot(entry);
  root.render(<RouterProvider router={router} />);
}
