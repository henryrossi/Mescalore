from django.db import models

# Create your models here.

class Category(models.Model):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    dessert = "dessert"
    snack = "snack"
    beverage = "beverage"
    other = "other"
    CategoryChocies = [
        (breakfast, "breakfast"),
        (lunch, "lunch"),
        (dinner, "dinner"),
        (dessert, "dessert"),
        (snack, "snack"),
        (beverage, "beverage"),
        (other, "other"),
    ]
    name = models.CharField(max_length=10, choices=CategoryChocies, default=other)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    name = models.CharField(max_length=100, unique=True)
    picture = models.ImageField(null=True, blank=True, upload_to='images/')
    description = models.TextField()
    time = models.IntegerField()
    servings = models.IntegerField()
    instructions = models.TextField()
    category = models.ManyToManyField(Category)

    def __str__(self):
        return self.name

class IngredientList(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE
    )
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.CASCADE
    )
    measurement = models.CharField(max_length=50)


# Tables for the search engine

class Term(models.Model):
    term = models.CharField(max_length=25, unique=True)

class TermData(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE
    )
    term = models.ForeignKey(
        Term, on_delete=models.CASCADE
    )
    frequency = models.IntegerField()

class TFIDF(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE
    )
    term = models.ForeignKey(
        Term, on_delete=models.CASCADE
    )
    score = models.FloatField()
