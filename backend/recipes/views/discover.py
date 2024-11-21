from django.forms import model_to_dict
from django.http import JsonResponse
from django.views import View
from recipes.models import Recipe
from recipes.serializers import RecipePreviewCategorySerializer


class Discover(View):
    def get(self, request):
        recipes = Recipe.objects.all()
        length = len(recipes)
        recipes = recipes[::-1] if length < 120 else recipes[length - 120 :][::-1]

        preview_serializer = RecipePreviewCategorySerializer(recipes, many=True)
        return JsonResponse({"data": preview_serializer.data})
