from django.http import JsonResponse
from django.views import View
from recipes.models import TFIDF, Recipe, Term
from recipes.search import Tokenizer
from recipes.serializers import RecipePreviewSerializer


class SearchRecipes(View):

    def get(self, request):
        query = request.GET["q"]
        offset = int(request.GET["offset"])
        limit = 4
        t = Tokenizer()
        searchedTerms = t.tokenize(query)
        if len(searchedTerms) == 0:
            ser = RecipePreviewSerializer(
                Recipe.objects.all()[offset : (offset + limit)], many=True
            )
            return JsonResponse(
                {
                    "data": {
                        "recipes": ser.data,
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
        recipes = [r for r, *_ in top]
        ser = RecipePreviewSerializer(recipes, many=True)
        return JsonResponse(
            {
                "data": {
                    "recipes": ser.data,
                    "count": Recipe.objects.all().count(),
                }
            }
        )
