import io

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from recipes.models import FavoriteRecipes, Recipe
from recipes.serializers import RecipeSerializer, calculateTFIDF
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

# Might want to add authors to recipe model


class RecipeData(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]

    def get(self, request, name):
        recipe = Recipe.objects.get(name=name)

        ser = RecipeSerializer(recipe)

        favorite = False
        if request.user.is_authenticated:
            favorite = FavoriteRecipes.objects.filter(
                recipe=recipe, user=request.user
            ).exists()
        data = dict(ser.data)
        data["favorite"] = favorite

        return JsonResponse({"data": data})

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


class UpdateRecipeData(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

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
