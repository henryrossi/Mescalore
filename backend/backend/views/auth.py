import os

from django.contrib.auth.models import ContentType, Permission
from recipes.models import Recipe
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


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


class MescolareTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)

        token["editorPermissions"] = checkRecipeEditingPermissions(user)

        return token


class MescolareTokenObatinPairView(TokenObtainPairView):
    serializer_class = MescolareTokenObtainPairSerializer
