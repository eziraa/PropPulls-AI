
from rest_framework import serializers
from core.models import AnalysisResult

class AnalysisResultSerializer(serializers.ModelSerializer):
    """
    Serializer for AnalysisResult model.
    Includes all fields and marks them as read-only except for the deal.
    """
    class Meta:
        model = AnalysisResult
        fields = '__all__'
        read_only_fields = ['id', 'deal', 'created_at']


class RecommendationsSerializer(serializers.Serializer):
    """
    Serializer for recommendations in AnalysisResult.
    Represents a list of recommendations based on the analysis.
    This is a simple serializer that expects a list of strings.
    """
    recommendations = serializers.ListField(
        child=serializers.CharField()
    )
