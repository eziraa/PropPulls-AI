from rest_framework import serializers
from core.models import FilterSetting

class FilterSettingSerializer(serializers.ModelSerializer):
    """
    Serializer for FilterSetting model.
    Includes all fields and marks them as read-only except for the user.
    """
    class Meta:
        model = FilterSetting
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']
