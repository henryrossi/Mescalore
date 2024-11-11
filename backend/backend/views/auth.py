from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MescolareTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)

        token["editorPermissions"] = False

        return token


class MescolareTokenObatinPairView(TokenObtainPairView):
    serializer_class = MescolareTokenObtainPairSerializer
