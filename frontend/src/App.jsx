import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import Recipe from "./pages/Recipe";
import EditRecipe from "./pages/EditRecipe";
import Search from "./pages/Search";
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ActivateEmail from "./pages/ActivateEmail";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/recipes" element={<Recipes />} />
        <Route exact path="/about" element={<AboutUs />} />
        <Route exact path="/create" element={<CreateRecipe />} />
        <Route exact path="/:recipeName" element={<Recipe />} />
        <Route exact path="/edit/:recipeName" element={<EditRecipe />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/sign-in" element={<SignIn />} />
        <Route exact path="/sign-up" element={<SignUp />} />
        <Route exact path="/activate/:token" element={<ActivateEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
