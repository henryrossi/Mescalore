from django.forms import model_to_dict
from django.http import JsonResponse
from django.views import View
from recipes.models import Recipe


def recipe_to_preview_dict(recipe):
    dict = model_to_dict(recipe)
    return {
        "name": dict["name"],
        "imageURL": dict["imageURL"],
        "categories": [cat.name for cat in dict["category"]],
    }


class Discover(View):
    def get(self, request):
        recipes = Recipe.objects.all()
        length = len(recipes)
        recipes = recipes[::-1] if length < 120 else recipes[length - 120 :][::-1]

        return JsonResponse(
            {"data": [recipe_to_preview_dict(recipe) for recipe in recipes]}
        )
