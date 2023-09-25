from django.test import TestCase
from graphene.test import Client
from recipes.models import Recipe, Category, Ingredient, IngredientList, \
    Term, TermData, TFIDF
from backend.schema import schema

from math import log

# Create your tests here.
class CreateRecipe(TestCase):
    def test_recipe_is_created(self):
        client = Client(schema)
        executed = client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "Test Recipe", categories: ["DINNER", "LUNCH"],
                      description: "Simple Recipe", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this recipe..."}
                ) {
                    success
                }
            }''')
        self.assertEqual(executed,{
            "data": {
                "createRecipe": {
                    "success": True
                }
            }
        })

class tfidfTest(TestCase):
    def test_updated_on_creation(self):
        client = Client(schema)
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "Test Recipe", categories: ["DINNER", "LUNCH"],
                      description: "Simple Recipe", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this recipe..."}
                ) {
                    success
                }
            }''')
        # Checking the tf-idf score for the term "recip" in recipe "Test Recipe"
        self.assertAlmostEqual(0, \
            TFIDF.objects.filter(term=2, recipe=1)[0].score)

        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "New Recipe", categories: ["DINNER", "LUNCH"],
                      description: " New Simple Recipe", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this recipe..."}
                ) {
                    success
                }
            }''')
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "New Recipe Again", categories: ["DINNER", "LUNCH"],
                      description: " New Simple Recipe", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this recipe..."}
                ) {
                    success
                }
            }''')
        # Checking the tf-idf score for the term "recip" in recipe "Test Recipe"
        self.assertAlmostEqual(0, \
            TFIDF.objects.filter(term=2, recipe=1)[0].score)
        # Checking the tf-idf score for the term "test" in recipe "Test Recipe"
        self.assertAlmostEqual((1/11)*log(3/(1+1)), \
            TFIDF.objects.filter(term=1, recipe=1)[0].score)
        
    def test_updated_on_edit(self):
        client = Client(schema)
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "Test Recipe", categories: ["DINNER", "LUNCH"],
                      description: "Simple Recipe", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this recipe..."}
                ) {
                    success
                }
            }''')
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "New Meal", categories: ["DINNER", "LUNCH"],
                      description: " New Simple Meal", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this meal..."}
                ) {
                    success
                }
            }''')
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "Hello", categories: ["DINNER", "LUNCH"],
                      description: " New Simple Meal", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this meal..."}
                ) {
                    success
                }
            }''')
        excecuted = client.execute(
            '''mutation MyMutation {
                editRecipe(
                    recipeData: {name: "Test Recipe", categories: ["DINNER", "LUNCH"],
                      description: "Simple Ingredients", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this meal..."}
                      recipeId: 1
                ) {
                    updated
                }
            }''')
        # May have to run this test on it's own ensure recipeId is correct above
        self.assertEqual(excecuted, {
            "data": {
                "editRecipe": {
                    "updated": True
                }
            }
        })
        # Checking the tf-idf score for the term "recip" in recipe "Test Recipe"
        self.assertAlmostEqual((1/13)*log(3/(1+1)), \
            TFIDF.objects.filter(term=2, recipe=1)[0].score)
    
    def test_updated_on_deletion(self):
        client = Client(schema)
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "Test Recipe", categories: ["DINNER", "LUNCH"],
                      description: "Simple Recipe", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this recipe..."}
                ) {
                    success
                }
            }''')
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "New Meal", categories: ["DINNER", "LUNCH"],
                      description: " New Simple Meal", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this meal..."}
                ) {
                    success
                }
            }''')
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "Hello", categories: ["DINNER", "LUNCH"],
                      description: " New Simple Meal", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this meal..."}
                ) {
                    success
                }
            }''')
        client.execute(
            '''mutation MyMutation {
                createRecipe(
                    recipeData: {name: "Hello Test", categories: ["DINNER", "LUNCH"],
                      description: " New Simple Meal", time: 10, servings: 2,
                      measurements: ["1 oz", "2 cup"], ingredients: ["cheese", "milk"], 
                      instructions: "Here's how you make this meal..."}
                ) {
                    success
                }
            }''')
        excecuted = client.execute(
            '''mutation MyMutation {
                deleteRecipe(RecipeID: "1") {
                    deleted
                }
            }''')
        # May have to run this test on it's own ensure recipeId is correct above
        self.assertEqual(excecuted, {
            "data": {
                "deleteRecipe": {
                    "deleted": True
                }
            }
        })
        # Checking the tf-idf score for the term "test" in recipe "Test Recipe"
        self.assertAlmostEqual((1/13)*log(3/(1+1)), \
            TFIDF.objects.filter(term=1, recipe=4)[0].score)