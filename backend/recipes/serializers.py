from math import log

from recipes.search import Tokenizer
from rest_framework import serializers

from .models import (
    TFIDF,
    Category,
    Ingredient,
    IngredientList,
    IngredientSection,
    Recipe,
    Term,
    TermData,
)


def addRecipe(recipe_data, recipe):
    t = Tokenizer()
    nameTerms = t.tokenize(recipe_data["name"])
    addTerms(nameTerms, recipe)
    descTerms = t.tokenize(recipe_data["description"])
    addTerms(descTerms, recipe)
    for section in recipe_data["ingredientSections"]:
        sectTerms = t.tokenize(section["name"])
        addTerms(sectTerms, recipe)
        for item in section["ingredients"]:
            measTerms = t.tokenize(item["measurement"])
            addTerms(measTerms, recipe)
            ingrTerms = t.tokenize(item["ingredient"]["name"])
            addTerms(ingrTerms, recipe)
    instructionTerms = t.tokenize(recipe_data["instructions"])
    addTerms(instructionTerms, recipe)


def addTerms(termList, recipe):
    for terms in termList:
        term, _ = Term.objects.get_or_create(term=terms)
        try:
            data = TermData.objects.get(recipe=recipe, term=term)
            data.frequency += 1
            data.save()
        except TermData.DoesNotExist:
            data = TermData(recipe=recipe, term=term, frequency=1)
            data.save()


def calculateTFIDF():
    # clear current TFIDF
    TFIDF.objects.all().delete()
    # calculate by recipe
    # calculate by term?
    n = Recipe.objects.count()
    for data in TermData.objects.all():
        tf = data.frequency / TermData.objects.filter(recipe=data.recipe).count()
        idf = log(n / (TermData.objects.filter(term=data.term).count() + 1))
        score = tf * idf
        if score < 0:
            score = 0
        tfidf = TFIDF(recipe=data.recipe, term=data.term, score=score)
        tfidf.save()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class IngredientSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[])

    class Meta:
        model = Ingredient
        fields = ["name"]


class IngredientsSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()
    measurement = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )

    class Meta:
        model = IngredientList
        fields = ["measurement", "ingredient"]
        depth = 1


class IngredientSectionSerializer(serializers.ModelSerializer):
    ingredients = IngredientsSerializer(many=True)
    name = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = IngredientSection
        fields = ["name", "ingredients"]


class RecipePreviewCategorySerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)

    class Meta:
        model = Recipe
        fields = ["name", "categories", "imageURL"]


class RecipePreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["name", "imageURL"]


class RecipeSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    ingredientSections = IngredientSectionSerializer(many=True)

    class Meta:
        model = Recipe
        fields = [
            "id",
            "name",
            "imageURL",
            "categories",
            "servings",
            "time",
            "description",
            "instructions",
            "ingredientSections",
        ]

    def create(self, validated_data):
        recipe = Recipe(
            name=validated_data["name"],
            imageURL=validated_data["imageURL"],
            description=validated_data["description"],
            time=validated_data["time"],
            servings=validated_data["servings"],
            instructions=validated_data["instructions"],
        )
        recipe.save()
        for category in validated_data["categories"]:
            cat, _ = Category.objects.get_or_create(name=category["name"])
            recipe.categories.add(cat)
        for section in validated_data["ingredientSections"]:
            sect, _ = IngredientSection.objects.get_or_create(
                recipe=recipe, name=section["name"]
            )
            for item in section["ingredients"]:
                ingr, _ = Ingredient.objects.get_or_create(
                    name=item["ingredient"]["name"]
                )
                ingList = IngredientList(
                    recipe=recipe,
                    section=sect,
                    ingredient=ingr,
                    measurement=item["measurement"],
                )
                ingList.save()

        # TF-IDF
        addRecipe(validated_data, recipe)
        calculateTFIDF()

        return recipe

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.imageURL = validated_data["imageURL"]
        instance.description = validated_data["description"]
        instance.time = validated_data["time"]
        instance.servings = validated_data["servings"]
        instance.instructions = validated_data["instructions"]
        instance.categories.clear()
        for category in validated_data["categories"]:
            cat, _ = Category.objects.get_or_create(name=category["name"])
            instance.categories.add(cat)

        IngredientSection.objects.filter(recipe=instance).delete()
        IngredientList.objects.filter(recipe=instance).delete()

        for section in validated_data["ingredientSections"]:
            sect, _ = IngredientSection.objects.get_or_create(
                recipe=instance, name=section["name"]
            )
            for item in section["ingredients"]:
                ingr, _ = Ingredient.objects.get_or_create(
                    name=item["ingredient"]["name"]
                )
                ingList = IngredientList(
                    recipe=instance,
                    section=sect,
                    ingredient=ingr,
                    measurement=item["measurement"],
                )
                ingList.save()

        instance.save()
        # TF-IDF
        addRecipe(validated_data, instance)
        calculateTFIDF()

        return instance
