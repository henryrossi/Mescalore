from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from recipes.views import discover, favorites, recipe, search, total

urlpatterns = [
    path("total", total.Total.as_view()),
    path("discover", discover.Discover.as_view()),
    path("search", search.SearchRecipes.as_view()),
    path("favorites", csrf_exempt(favorites.Favorites.as_view())),
    path("<str:name>", recipe.RecipeData.as_view()),
]
