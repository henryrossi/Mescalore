from django.http import JsonResponse
from django.views import View
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer


class RecipeData(View):
    def get(self, request, name):
        recipe = Recipe.objects.get(name=name)

        ser = RecipeSerializer(recipe)
        # Need to come back to jwt auth to set favorite
        return JsonResponse({"data": ser.data})
