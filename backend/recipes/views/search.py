from math import log

from django.forms import model_to_dict
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


def recipe_to_preview_dict(recipe):
    dict = model_to_dict(recipe)
    return {
        "name": dict["name"],
        "imageURL": dict["imageURL"],
    }


class SearchRecipes(View):

    def get(self, request):
        searchText = request.GET["searchText"]
        offset = int(request.GET["offset"])
        limit = 12
        if searchText == "":
            return JsonResponse(
                {
                    "data": [
                        recipe_to_preview_dict(r)
                        for r in Recipe.objects.all()[offset : (offset + limit)]
                    ]
                }
            )
        t = Tokenizer()
        searchedTerms = t.tokenize(searchText)
        if len(searchedTerms) == 0:
            return JsonResponse(
                {
                    "data": [
                        recipe_to_preview_dict(r)
                        for r in Recipe.objects.all()[offset : (offset + limit)]
                    ]
                }
            )
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
        return JsonResponse({"data": [recipe_to_preview_dict(r) for r, *_ in top]})
