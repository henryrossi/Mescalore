from rest_framework import serializers

from .models import Category, Ingredient, IngredientList, IngredientSection, Recipe


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["name"]


class IngredientsSerializer(serializers.ModelSerializer):
    ingredient = serializers.SerializerMethodField()

    class Meta:
        model = IngredientList
        fields = ["measurement", "ingredient"]
        depth = 1

    def get_ingredient(self, obj):
        ingr = IngredientSerializer(obj.ingredient)
        return ingr.data["name"]


class IngredientSectionSerializer(serializers.ModelSerializer):
    ingredients = IngredientsSerializer(many=True)

    class Meta:
        model = IngredientSection
        fields = ["name", "ingredients"]


class RecipePreviewCategorySerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ["name", "categories", "imageURL"]

    def get_categories(self, obj):
        cats = CategorySerializer(obj.categories, many=True)
        return [cat["name"] for cat in cats.data]


class RecipePreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["name", "imageURL"]


class RecipeSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()
    ingredientSections = IngredientSectionSerializer(many=True)

    class Meta:
        model = Recipe
        fields = [
            "name",
            "imageURL",
            "categories",
            "servings",
            "time",
            "description",
            "instructions",
            "ingredientSections",
        ]

    def get_categories(self, obj):
        cats = CategorySerializer(obj.categories, many=True)
        return [cat["name"] for cat in cats.data]
