import os
import secrets
from math import log

import boto3
import graphene
from botocore.config import Config
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from dotenv import load_dotenv
from graphene_django import DjangoObjectType
from graphql_auth import mutations
from graphql_auth.schema import MeQuery, UserQuery

load_dotenv()


# AWS S3
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")
REGION_NAME = os.getenv("REGION_NAME")
my_config = Config(
    signature_version="v4",
)

from recipes.models import (
    TFIDF,
    Category,
    FavoriteRecipes,
    Ingredient,
    IngredientList,
    IngredientSection,
    Recipe,
    Term,
    TermData,
)
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


class IngredientSectionType(DjangoObjectType):
    class Meta:
        model = IngredientSection
        fields = ("id", "name")

    ingredient_list = graphene.List(IngredientListType)

    def resolve_ingredient_list(self, info):
        return IngredientList.objects.filter(section=self)


class RecipeType(DjangoObjectType):
    class Meta:
        model = Recipe
        fields = (
            "id",
            "name",
            "description",
            "time",
            "servings",
            "instructions",
            "category",
            "imageURL",
        )

    ingredient_sections = graphene.List(IngredientSectionType)
    favorite = graphene.Boolean()

    def resolve_ingredient_sections(self, info):
        return IngredientSection.objects.filter(recipe=self)

    def resolve_favorite(self, info):
        user = info.context.user
        if user.is_authenticated:
            return FavoriteRecipes.objects.filter(user=user, recipe=self).exists()
        return False


class IngredientInput(graphene.InputObjectType):
    ingredient = graphene.String(required=True)
    measurement = graphene.String(required=True)


class IngredientSectionInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    ingredients = graphene.List(IngredientInput, required=True)


class RecipeInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    imageURL = graphene.String(required=False)
    categories = graphene.List(graphene.String, required=True)
    description = graphene.String(required=True)
    time = graphene.Int(required=True)
    servings = graphene.Int(required=True)
    sections = graphene.List(IngredientSectionInput, required=True)
    instructions = graphene.String(required=True)


def addRecipe(recipe_data, recipe):
    t = Tokenizer()
    nameTerms = t.tokenize(recipe_data.name)
    addTerms(nameTerms, recipe)
    descTerms = t.tokenize(recipe_data.description)
    addTerms(descTerms, recipe)
    for section in recipe_data.sections:
        sectTerms = t.tokenize(section.name)
        addTerms(sectTerms, recipe)
        for item in section.ingredients:
            measTerms = t.tokenize(item.measurement)
            addTerms(measTerms, recipe)
            ingrTerms = t.tokenize(item.ingredient)
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
            score = 0
        tfidf = TFIDF(recipe=data.recipe, term=data.term, score=score)
        tfidf.save()


class Query(UserQuery, MeQuery, graphene.ObjectType):
    get_recipes_by_category = graphene.List(RecipeType, category=graphene.String())
    get_recipe_by_name = graphene.Field(RecipeType, name=graphene.String())
    search_recipes = graphene.List(
        RecipeType, searchText=graphene.String(), offset=graphene.Int()
    )
    get_number_of_recipes = graphene.Int()
    get_s3_presigned_url = graphene.String()
    get_favorite_recipes = graphene.List(
        RecipeType, searchText=graphene.String(), offset=graphene.Int()
    )
    get_number_of_favorites = graphene.Int()

    # Query needs to be rewritten now that sorting is done client-side.
    # Should probably keep both.
    def resolve_get_recipes_by_category(root, info, category):
        if category == "":
            recipeQueryset = Recipe.objects.all()
            length = len(recipeQueryset)
            if length < 120:
                return recipeQueryset[::-1]
            return recipeQueryset[length - 120 :][::-1]
        cat_id = Category.objects.filter(name=category)[:1]
        recipeQueryset = Recipe.objects.filter(category=cat_id)
        length = len(recipeQueryset)
        if length < 120:
            return recipeQueryset[::-1]
        return recipeQueryset[length - 120 :][::-1]

    def resolve_get_recipe_by_name(root, info, name):
        return Recipe.objects.filter(name=name)[0]

    def resolve_search_recipes(root, info, searchText, offset):
        limit = 12
        if searchText == "":
            return []
        t = Tokenizer()
        searchedTerms = t.tokenize(searchText)
        if len(searchedTerms) == 0:
            return Recipe.objects.all()[offset : (offset + limit)]
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
        top = tuples[offset : (offset + limit)]
        return [r for r, *_ in top]

    def resolve_get_number_of_recipes(root, info):
        return Recipe.objects.count()

    def resolve_get_s3_presigned_url(root, info):
        n = 30 * 3 // 4
        imageName = secrets.token_urlsafe(n)

        client = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=REGION_NAME,
            config=my_config,
        )
        try:
            response = client.generate_presigned_url(
                "put_object",
                Params={"Bucket": S3_BUCKET, "Key": imageName},
                ExpiresIn=3600,
            )
        except Exception as e:
            print(e)
            return None
        return response

    def resolve_get_favorite_recipes(root, info, searchText, offset):
        print(searchText)
        limit = 12
        user = info.context.user
        if user.is_authenticated:
            print(user)
            # if searchText == "":
            # Feels assuredly inefficient
            favorites = FavoriteRecipes.objects.filter(user=user).values_list("recipe")
            recipes = Recipe.objects.filter(pk__in=favorites)
            t = Tokenizer()
            searchedTerms = t.tokenize(searchText)
            if len(searchedTerms) == 0:
                return recipes[offset : (offset + limit)]
            tuples = []
            for recipe in recipes:
                score = 0
                for term in searchedTerms:
                    qsTermID = Term.objects.filter(term=term)
                    if len(qsTermID) > 0:
                        qsTFIDF = TFIDF.objects.filter(recipe=recipe, term=qsTermID[0])
                        if len(qsTFIDF) > 0:
                            score += qsTFIDF[0].score
                tuples.append((recipe, score))
            tuples.sort(key=lambda tup: tup[1], reverse=True)
            top = tuples[offset : (offset + limit)]
            return [r for r, *_ in top]
        return []

    def resolve_get_number_of_favorites(root, info):
        user = info.context.user
        if user.is_authenticated:
            return FavoriteRecipes.objects.filter(user=user).count()
        return 0


def checkRecipeEditingPermissions(user) -> bool:
    if user.username == os.getenv("ADMIN_USERNAME_1") or user.username == os.getenv(
        "ADMIN_USERNAME_2"
    ):
        content_type = ContentType.objects.get_for_model(Recipe)
        recipe_permissions = Permission.objects.filter(content_type=content_type)
        for perm in recipe_permissions:
            user.user_permissions.add(perm)
        return True
    return False


class CreateRecipe(graphene.Mutation):
    class Arguments:
        recipe_data = RecipeInput(required=True)

    # The class attributes define the response of the mutation
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, recipe_data):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if not user.has_perm(
            "recipes.add_recipe"
        ) and not checkRecipeEditingPermissions(user):
            raise Exception("You do not have the credential to perform this action")
        try:
            recipe = Recipe(
                name=recipe_data.name,
                imageURL=recipe_data.imageURL,
                description=recipe_data.description,
                time=recipe_data.time,
                servings=recipe_data.servings,
                instructions=recipe_data.instructions,
            )
            recipe.save()
            for category in recipe_data.categories:
                cat, created = Category.objects.get_or_create(name=category)
                recipe.category.add(cat)
            for section in recipe_data.sections:
                sect, created = IngredientSection.objects.get_or_create(
                    recipe=recipe, name=section.name
                )
                for item in section.ingredients:
                    ingr, created = Ingredient.objects.get_or_create(
                        name=item.ingredient
                    )
                    ingList = IngredientList(
                        recipe=recipe,
                        section=sect,
                        ingredient=ingr,
                        measurement=item.measurement,
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
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if not user.has_perm(
            "recipes.delete_recipe"
        ) and not checkRecipeEditingPermissions(user):
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
        if not user.has_perm(
            "recipes.change_recipe"
        ) and not checkRecipeEditingPermissions(user):
            raise Exception("You do not have the credential to perform this action")
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            recipe.name = recipe_data.name
            recipe.description = recipe_data.description
            recipe.servings = recipe_data.servings
            recipe.time = recipe_data.time
            recipe.category.clear()
            for category in recipe_data.categories:
                cat, created = Category.objects.get_or_create(name=category)
                recipe.category.add(cat)
            if recipe_data.imageURL is not None:
                recipe.imageURL = recipe_data.imageURL
            IngredientSection.objects.filter(recipe=recipe_id).delete()
            IngredientList.objects.filter(recipe=recipe_id).delete()
            for section in recipe_data.sections:
                sect = IngredientSection(
                    recipe=recipe,
                    name=section.name,
                )
                sect.save()
                for item in section.ingredients:
                    ingr, created = Ingredient.objects.get_or_create(
                        name=item.ingredient
                    )
                    ingList = IngredientList(
                        recipe=recipe,
                        section=sect,
                        ingredient=ingr,
                        measurement=item.measurement,
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


class FavoriteRecipe(graphene.Mutation):
    class Arguments:
        recipe_id = graphene.ID()

    updated = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, recipe_id):
        user = info.context.user
        if not user.is_authenticated:
            return FavoriteRecipe(updated=False)
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            favorite, created = FavoriteRecipes.objects.get_or_create(
                recipe=recipe, user=user
            )
            if not created:
                return FavoriteRecipe(updated=False)
            favorite.save()
            print(FavoriteRecipes.objects.all())
            return FavoriteRecipe(updated=True)
        except Exception as e:
            print(e)
            return FavoriteRecipe(updated=False)


class UnfavoriteRecipe(graphene.Mutation):
    class Arguments:
        recipe_id = graphene.ID()

    updated = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, recipe_id):
        user = info.context.user
        if not user.is_authenticated:
            return FavoriteRecipe(updated=False)
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            favorite, created = FavoriteRecipes.objects.get_or_create(
                recipe=recipe, user=user
            )
            if created:
                return FavoriteRecipe(updated=False)
            favorite.delete()
            print(FavoriteRecipes.objects.all())
            return FavoriteRecipe(updated=True)
        except Exception as e:
            print(e)
            return FavoriteRecipe(updated=False)


class RegisterUser(mutations.Register):
    recipeEditor = graphene.Boolean()

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        res = super().resolve_mutation(root, info, **kwargs)
        # new account doesn't really have any permissions yet
        editorPermissions = False
        return cls(
            success=res.success,
            errors=res.errors,
            token=res.token,
            recipeEditor=editorPermissions,
        )


class AuthenticateUser(mutations.ObtainJSONWebToken):
    recipeEditor = graphene.Boolean()

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        res = super().resolve_mutation(root, info, **kwargs)

        if not res.user:
            return res

        editorPermissions = False
        if (
            res.user.has_perm("recipes.add_recipe")
            and res.user.has_perm("recipes.change_recipe")
            and res.user.has_perm("recipes.delete_recipe")
        ):
            editorPermissions = True

        return cls(
            success=res.success,
            errors=res.errors,
            token=res.token,
            user=res.user,
            recipeEditor=editorPermissions,
            unarchiving=res.unarchiving,
        )


class Mutation(graphene.ObjectType):
    create_recipe = CreateRecipe.Field()
    delete_recipe = DeleteRecipe.Field()
    edit_recipe = EditRecipe.Field()

    favorite_recipe = FavoriteRecipe.Field()
    unfavorite_recipe = UnfavoriteRecipe.Field()

    user_registration = RegisterUser.Field()
    user_verification = mutations.VerifyAccount.Field()
    user_authentication = AuthenticateUser.Field()
    revoke_Token = mutations.RevokeToken.Field()
    update_account = mutations.UpdateAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    delete_account = mutations.DeleteAccount.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
