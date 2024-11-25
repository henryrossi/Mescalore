from django.http import JsonResponse
from recipes.models import TFIDF, FavoriteRecipes, Recipe, Term
from recipes.search import Tokenizer
from recipes.serializers import RecipePreviewSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication


class Favorites(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        searchText = request.GET["q"]
        offset = int(request.GET["offset"])
        limit = 4
        user = request.user
        # if searchText == "":
        # Feels assuredly inefficient
        favorites = FavoriteRecipes.objects.filter(user=user).values_list("recipe")
        count = favorites.count()
        recipes = Recipe.objects.filter(pk__in=favorites)
        t = Tokenizer()
        searchedTerms = t.tokenize(searchText)
        if len(searchedTerms) == 0:
            ser = RecipePreviewSerializer(recipes[offset : (offset + limit)], many=True)
            return JsonResponse(
                {
                    "data": {
                        "recipes": ser.data,
                        "count": count,
                    }
                }
            )
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
        ser = RecipePreviewSerializer([r for r, *_, in top], many=True)
        return JsonResponse(
            {
                "data": {
                    "recipes": ser.data,
                    "count": count,
                }
            }
        )
