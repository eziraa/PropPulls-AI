
from rest_framework import serializers
from core.models import Deal

class DealReadSerializer(serializers.ModelSerializer):
    """
    Serializer for reading Deal instances.
    Includes all fields and marks them as read-only except for the user.
    """
    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'fetched_data']


class DealWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for writing Deal instances.
    Excludes user, created_at, and fetched_data fields to allow creation and updates.
    """
    class Meta:
        model = Deal
        exclude = ['user', 'created_at', 'fetched_data']
