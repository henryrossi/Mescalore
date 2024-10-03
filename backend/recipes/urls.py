from django.urls import path
from recipes.views import recipe, total

urlpatterns = [
    path("total", total.Total.as_view()),
    path("<str:name>", recipe.RecipeData.as_view()),
]
