import io

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views import View
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer, calculateTFIDF
from rest_framework.parsers import JSONParser

# Might want to add authors to recipe model


class RecipeData(View):
    def get(self, _, name):
        recipe = Recipe.objects.get(name=name)

        ser = RecipeSerializer(recipe)
        # Need to come back to jwt auth to set favorite
        return JsonResponse({"data": ser.data})

    def post(self, request, name):
        if Recipe.objects.filter(name=name).exists():
            return JsonResponse({}, status=400)

        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)

        ser = RecipeSerializer(data=data)
        if ser.is_valid():
            ser.save()
            return JsonResponse({})
        else:
            return JsonResponse({}, status=400)

    def delete(self, _, name):
        try:
            recipe = Recipe.objects.get(name=name)
            recipe.delete()
            calculateTFIDF()
            return JsonResponse({})
        except ObjectDoesNotExist:
            return JsonResponse({}, status=400)


class UpdateRecipeData(View):
    def put(self, request, id):
        try:
            recipe = Recipe.objects.get(id=id)

            stream = io.BytesIO(request.body)
            data = JSONParser().parse(stream)

            ser = RecipeSerializer(recipe, data=data)
            if ser.is_valid():
                ser.save()
                return JsonResponse({})
            else:
                return JsonResponse({}, status=400)
        except ObjectDoesNotExist:
            return JsonResponse({}, status=400)
