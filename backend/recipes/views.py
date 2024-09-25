from django.http import HttpResponse
from django.views import View


class CustomView(View):
    def get(self, request):
        return HttpResponse()
