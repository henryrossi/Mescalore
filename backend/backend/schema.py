import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
from graphql_auth.schema import MeQuery, UserQuery
from graphql_auth import mutations

import base64
from . import base64Scalar
from math import log

import os
from dotenv import load_dotenv
load_dotenv()

from recipes.models import Category, Recipe, Ingredient, IngredientList, \
    Term, TermData, TFIDF
from recipes.search import Tokenizer

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ("id", "name")

class IngredientType(DjangoObjectType):
    class Meta:
        model = Ingredient
        fields = ("id", "name")

class IngredientListType(DjangoObjectType):
    class Meta:
        model = IngredientList
        fields = ("id", "recipe", "ingredient", "measurement")

class RecipeType(DjangoObjectType):
    class Meta:
        model = Recipe
        fields = ("id", "name", "description", "time", "servings", \
                  "instructions", "category", "picture")
    
    # With the current design pictures never exceed 650 x 650 pixels
    # Size now doesn't exceed 605 pixels
    # Keeping images small is ideal
    ingredient_list = graphene.List(IngredientListType)
    # base64picture = base64Scalar.Base64()

    def resolve_ingredient_list(self, info):
        return IngredientList.objects.filter(recipe=self.id)
    
    # def resolve_base64picture(self, info):
    #     if self.picture and hasattr(self.picture, 'url'):
    #         encoded_string = base64.b64encode(self.picture.read())
    #         return encoded_string
    #     return ""

class RecipeInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    picture = Upload(required=False)
    categories = graphene.List(graphene.String, required=True)
    description = graphene.String(required=True)
    time = graphene.Int(required=True)
    servings = graphene.Int(required=True)
    measurements = graphene.List(graphene.String, required=True)
    ingredients = graphene.List(graphene.String, required=True)
    instructions = graphene.String(required=True)
    
def addRecipe(recipe_data, recipe):
    t = Tokenizer()
    nameTerms = t.tokenize(recipe_data.name)
    addTerms(nameTerms, recipe)
    descTerms = t.tokenize(recipe_data.description)
    addTerms(descTerms, recipe)
    for measurement in recipe_data.measurements:
        measTerms = t.tokenize(measurement)
        addTerms(measTerms, recipe)
    for ingredient in recipe_data.ingredients:
        ingrTerms = t.tokenize(ingredient)
        addTerms(ingrTerms, recipe)
    instructionTerms = t.tokenize(recipe_data.instructions)
    addTerms(instructionTerms, recipe)

def addTerms(termList, recipe):
    for terms in termList:
        term, created = Term.objects.get_or_create(term=terms)
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
            score  = 0
        tfidf = TFIDF(recipe=data.recipe, term=data.term, score=score)
        tfidf.save()

class Query(UserQuery, MeQuery, graphene.ObjectType):
    get_recipes_by_category = graphene.List(RecipeType, category=graphene.String())
    get_recipe_by_name = graphene.Field(RecipeType, name=graphene.String())
    search_recipes = graphene.List(RecipeType, searchText=graphene.String(), \
                                   offset=graphene.Int(), limit=graphene.Int())
    get_number_of_recipes = graphene.Int()
    
    def resolve_get_recipes_by_category(root, info, category):
        if category == "":
            recipeQueryset = Recipe.objects.all()
            length = len(recipeQueryset)
            if length < 12:
                return recipeQueryset[::-1]
            return recipeQueryset[length-12:][::-1]
        cat_id = Category.objects.filter(name=category)[:1]
        recipeQueryset = Recipe.objects.filter(category=cat_id)
        length = len(recipeQueryset)
        if length < 12:
                return recipeQueryset[::-1]
        return recipeQueryset[length-12:][::-1]
    
    def resolve_get_recipe_by_name(root, info, name):
        return Recipe.objects.filter(name=name)[0]
    
    def resolve_search_recipes(root, info, searchText, offset, limit):
        if searchText == "":
            return []
        t = Tokenizer()
        searchedTerms = t.tokenize(searchText)
        if len(searchedTerms) == 0:
            return Recipe.objects.all()[offset:(offset+limit)]
        tuples = []
        for recipe in Recipe.objects.all():
            score = 0
            for term in searchedTerms:
                qsTermID = Term.objects.filter(term=term)
                if len(qsTermID) > 0:
                    qsTFIDF = TFIDF.objects.filter(recipe=recipe, term=qsTermID[0])
                    if len(qsTFIDF) > 0:
                        score += qsTFIDF[0].score
            tuples.append((recipe, score))
        tuples.sort(key=lambda tup: tup[1], reverse=True)
        top = tuples[offset:(offset+limit)]
        return [r for r, *_ in top]
    
    def resolve_get_number_of_recipes(root, info):
        return Recipe.objects.count()
    
def checkAdminPrivileges(user) -> bool:
    if user.username == os.getenv("ADMIN_USERNAME_1"): return True
    if user.username == os.getenv("ADMIN_USERNAME_2"): return True
    return False
    
class CreateRecipe(graphene.Mutation):
    class Arguments:
        recipe_data = RecipeInput(required=True)
    
    # The class attributes define the response of the mutation
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, recipe_data):
        user = info.context.user
        print(user.username)
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if not checkAdminPrivileges(user):
            raise Exception("You do not have the credential to perform this action")
        try:
            recipe = Recipe(
                name = recipe_data.name,
                picture = recipe_data.picture,
                description = recipe_data.description,
                time = recipe_data.time,
                servings = recipe_data.servings,
                instructions = recipe_data.instructions,
                )
            recipe.save()
            for category in recipe_data.categories:
                cat, created = Category.objects.get_or_create(name = category)
                recipe.category.add(cat)
            for item in zip(recipe_data.ingredients, recipe_data.measurements):
                ingr, created = Ingredient.objects.get_or_create(name = item[0])
                ingList = IngredientList(
                    recipe = recipe,
                    ingredient = ingr,
                    measurement = item[1]
                )
                ingList.save()
            # TF-IDF
            addRecipe(recipe_data, recipe)
            calculateTFIDF()
            # Notice we return an instance of this mutation
            return CreateRecipe(success=True)
        except Exception as e: 
            print(e)
            CreateRecipe(success=False)

class DeleteRecipe(graphene.Mutation):
    class Arguments:
        RecipeID = graphene.ID(required=True)

    # Could make the return field more complex
    deleted = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, RecipeID):
        if not info.context.user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if not checkAdminPrivileges(info.context.user):
            raise Exception("You do not have the credential to perform this action")
        try:
            recipe = Recipe.objects.get(pk=RecipeID)
            recipe.delete()
            calculateTFIDF()
            return DeleteRecipe(deleted=True)
        except Recipe.DoesNotExist:
            print(Recipe.DoesNotExist)
            return DeleteRecipe(deleted=False)
        
class EditRecipe(graphene.Mutation):
    class Arguments:
        recipe_id = graphene.ID(required=True)
        recipe_data = RecipeInput(required=True)

    
    updated = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, recipe_data, recipe_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if not checkAdminPrivileges(user):
            raise Exception("You do not have the credential to perform this action")
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            recipe.name = recipe_data.name
            recipe.description = recipe_data.description
            recipe.servings = recipe_data.servings
            recipe.time = recipe_data.time
            recipe.category.clear()
            for category in recipe_data.categories:
                cat, created = Category.objects.get_or_create(name = category)
                recipe.category.add(cat)
            if recipe_data.picture is not None:
                recipe.picture = recipe_data.picture
            recipe.measurements = recipe_data.measurements
            IngredientList.objects.filter(recipe = recipe_id).delete()
            for item in zip(recipe_data.ingredients, recipe_data.measurements):
                ingr, created = Ingredient.objects.get_or_create(name = item[0])
                ingList = IngredientList(
                    recipe = recipe,
                    ingredient = ingr,
                    measurement = item[1]
                )
                ingList.save()
            recipe.instructions = recipe_data.instructions
            recipe.save()
            # TF-IDF
            TermData.objects.filter(recipe=recipe).delete()
            addRecipe(recipe_data, recipe)
            calculateTFIDF()
            return EditRecipe(updated=True)
        except Exception as e: 
            print(e)
            return EditRecipe(updated=False)

class Mutation(graphene.ObjectType):
    create_recipe = CreateRecipe.Field()
    delete_recipe = DeleteRecipe.Field()
    edit_recipe = EditRecipe.Field()

    user_registration = mutations.Register.Field()
    user_verification = mutations.VerifyAccount.Field()
    user_authentication = mutations.ObtainJSONWebToken.Field()
    revoke_Token = mutations.RevokeToken.Field()
    update_account = mutations.UpdateAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    delete_account = mutations.DeleteAccount.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)