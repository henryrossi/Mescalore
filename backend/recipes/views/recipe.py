from django.forms import model_to_dict
from django.http import JsonResponse
from django.views import View
from recipes.models import FavoriteRecipes, IngredientList, IngredientSection, Recipe


def recipe_to_dict(recipe):
    def ingredients_for_section(section):
        ingrs = IngredientList.objects.filter(section=section)
        ingredients = [
            {"measurement": ingr.measurement, "ingredient": ingr.ingredient.name}
            for ingr in ingrs
        ]
        return ingredients

    dict = model_to_dict(recipe)
    ingr_sections = IngredientSection.objects.filter(recipe=recipe)

    dict["categories"] = [cat.name for cat in dict["category"]]
    del dict["category"]

    dict["ingredientSections"] = [
        {"name": section.name, "ingredients": ingredients_for_section(section)}
        for section in ingr_sections
    ]
    return dict


class RecipeData(View):
    def get(self, request, name):
        recipe = Recipe.objects.get(name=name)
        dict = recipe_to_dict(recipe)
        # Need to come back to jwt auth
        dict["favorite"] = False
        return JsonResponse({"data": dict})
