import os
import secrets

import boto3
from botocore.config import Config
from django.http import JsonResponse
from dotenv import load_dotenv
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

load_dotenv()

# AWS S3
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")
REGION_NAME = os.getenv("REGION_NAME")
my_config = Config(
    signature_version="v4",
)


class PresignedURL(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        n = 30 * 3 // 4
        imageName = secrets.token_urlsafe(n)

        client = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=REGION_NAME,
            config=my_config,
        )
        try:
            response = client.generate_presigned_url(
                "put_object",
                Params={"Bucket": S3_BUCKET, "Key": imageName},
                ExpiresIn=3600,
            )
        except Exception as e:
            print(e)
            return None
        return JsonResponse({"data": response})
