from django.http import JsonResponse
from django.views import View
from recipes.models import Recipe


class Total(View):
    def get(self, request):
        return JsonResponse({"data": Recipe.objects.count()})
