import os

from django.contrib.auth import get_user_model
from django.contrib.auth.models import ContentType, Permission
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from recipes.models import PasswordReset, Recipe
from rest_framework import serializers
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework.views import APIView, Response
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


class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "password", "confirm_password"]

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"],
        )
        return user


class RegisterUserView(CreateAPIView):
    model = get_user_model()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


class ResetPasswordRequestView(APIView):
    def post(self, request):
        email = request.data["email"]
        user = get_user_model().objects.filter(email__iexact=email).first()

        if user:
            token_gen = PasswordResetTokenGenerator()
            token = token_gen.make_token(user)
            reset = PasswordReset(email=email, token=token)
            reset.save()

            subject = render_to_string(
                "templates/emails/password_reset_subject.txt",
            )
            message = render_to_string(
                "templates/emails/password_reset_email.html",
                context={
                    "user": user,
                    "protocol": request.scheme,
                    "frontend_domain": os.getenv("FRONTEND_DOMAIN", "localhost:3000"),
                    "token": token,
                },
            )
            send_mail(subject, message, os.getenv("EMAIL_HOST_USER"), [email])

        return Response({})


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)


class ResetPasswordView(APIView):
    def post(self, request, token):
        ser = ResetPasswordSerializer(data=request.data)
        if not ser.is_valid():
            return Response({}, status=400)
        new_password = ser.validated_data["new_password"]
        confirm_password = ser.validated_data["confirm_password"]

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)

        reset = PasswordReset.objects.filter(token=token).first()
        if not reset:
            return Response({"error": "Invalid token"}, status=400)

        user = get_user_model().objects.filter(emial=reset.email).first()
        if not user:
            return Response({"error": "No user found"}, status=400)

        user.set_password(new_password)
        user.save()
        reset.delete()

        return Response({"success": True})


class MescolareTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)

        token["editorPermissions"] = checkRecipeEditingPermissions(user)

        return token


class MescolareTokenObatinPairView(TokenObtainPairView):
    serializer_class = MescolareTokenObtainPairSerializer
