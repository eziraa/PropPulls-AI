
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Validates and creates a new user.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile.
    Returns user details without sensitive information.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Validates user credentials and returns the user instance.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        return {'user': user}