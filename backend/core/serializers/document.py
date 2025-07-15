
from core.models import UploadedDocument
from rest_framework import serializers

class UploadedDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for UploadedDocument model.
    Includes all fields and marks them as read-only except for the deal.
    """
    class Meta:
        model = UploadedDocument
        fields = '__all__'
        read_only_fields = ['id', 'deal', 'uploaded_at', 'parsed_data']
