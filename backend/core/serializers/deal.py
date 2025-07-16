
from rest_framework import serializers
from core.models import Deal
from core.serializers.analasisResult import AnalysisResultSerializer
class DealReadSerializer(serializers.ModelSerializer):
    """
    Serializer for reading Deal instances.
    Includes all fields and marks them as read-only except for the user.
    """
    analysis_result = serializers.SerializerMethodField()
    pass_status = serializers.SerializerMethodField()
    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at',  'fetched_data']
    def get_analysis_result(self, obj):
        """
        Custom method to get the analysis result for the deal.
        """
        if hasattr(obj, 'analysis_result'):
            return AnalysisResultSerializer(obj.analysis_result).data
        return None
    def get_pass_status(self, obj):
        if hasattr(obj, 'analysis_result') and obj.analysis_result:
            return True
        return False


class DealWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for writing Deal instances.
    Excludes user, created_at, and fetched_data fields to allow creation and updates.
    """
    class Meta:
        model = Deal
        exclude = ['user', 'created_at', 'fetched_data']
