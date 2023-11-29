import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import Recipe from "./pages/Recipe";
import EditRecipe from "./pages/EditRecipe";
import Search from "./pages/Search";
import Login from "./pages/Login";
import ActivateEmail from "./pages/ActivateEmail";
import Register from "./pages/Register";

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
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/activate/:token" element={<ActivateEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
