
from core.models import ExportedFile
from rest_framework import serializers

class ExportedFileSerializer(serializers.ModelSerializer):
    """
    Serializer for ExportedFile model.
    Includes all fields and marks them as read-only except for the deal.
    """
    class Meta:
        model = ExportedFile
        fields = '__all__'
        read_only_fields = ['id', 'deal', 'generated_at']
