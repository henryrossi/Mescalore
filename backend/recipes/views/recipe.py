from django.forms import model_to_dict
from django.http import JsonResponse
from django.views import View
from recipes.models import Recipe


class RecipeData(View):
    def get(self, request, name):
        recipe = Recipe.objects.get(name=name)
        recipe = model_to_dict(recipe)
        recipe["category"] = [model_to_dict(cat) for cat in recipe["category"]]

        return JsonResponse({"data": recipe})
