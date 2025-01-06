from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from recipes.views import discover, favorites, presignedURL, recipe, search

urlpatterns = [
    path("discover", discover.Discover.as_view()),
    path("search", search.SearchRecipes.as_view()),
    path("favorites", csrf_exempt(favorites.Favorites.as_view())),
    path("presignedURL", csrf_exempt(presignedURL.PresignedURL.as_view())),
    path("<str:name>", csrf_exempt(recipe.RecipeData.as_view())),
    path("id/<int:id>", csrf_exempt(recipe.UpdateRecipeData.as_view())),
]
