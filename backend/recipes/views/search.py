from math import log

from django.forms import model_to_dict
from django.http import JsonResponse
from django.views import View
from recipes.models import TFIDF, Recipe, Term
from recipes.search import Tokenizer


def recipe_to_preview_dict(recipe):
    dict = model_to_dict(recipe)
    return {
        "name": dict["name"],
        "imageURL": dict["imageURL"],
    }


class SearchRecipes(View):

    def get(self, request):
        query = request.GET["q"]
        offset = int(request.GET["offset"])
        limit = 4
        # if query == "":
        #     return JsonResponse(
        #         {
        #             "data": [
        #                 recipe_to_preview_dict(r)
        #                 for r in Recipe.objects.all()[offset : (offset + limit)]
        #             ]
        #         }
        #     )
        t = Tokenizer()
        searchedTerms = t.tokenize(query)
        if len(searchedTerms) == 0:
            return JsonResponse(
                {
                    "data": {
                        "recipes": [
                            recipe_to_preview_dict(r)
                            for r in Recipe.objects.all()[offset : (offset + limit)]
                        ],
                        "count": Recipe.objects.all().count(),
                    }
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
        return JsonResponse(
            {
                "data": {
                    "recipes": [recipe_to_preview_dict(r) for r, *_ in top],
                    "count": Recipe.objects.all().count(),
                }
            }
        )
