from math import log

from django.http import JsonResponse
from django.views import View
from recipes.models import TFIDF, Recipe, Term, TermData
from recipes.search import Tokenizer


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


class SearchRecipes(View):
    def get(self, request):
        return JsonResponse()
