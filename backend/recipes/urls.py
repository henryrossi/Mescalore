from django.urls import path
from recipes.views import discover, recipe, total

urlpatterns = [
    path("total", total.Total.as_view()),
    path("discover", discover.Discover.as_view()),
    path("<str:name>", recipe.RecipeData.as_view()),
]
