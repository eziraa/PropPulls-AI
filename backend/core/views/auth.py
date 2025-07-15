
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from core.serializers.auth import RegisterSerializer, UserProfileSerializer

class RegisterAPIView(APIView):
    """
    Register a new user
    POST /auth/register/
    This endpoint allows new users to register by providing their details.
    It returns a success message upon successful registration.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=201)
        return Response(serializer.errors, status=400)


class MeAPIView(APIView):
    """Retrieve the authenticated user's profile
    GET /auth/me/
    This endpoint returns the profile information of the currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
