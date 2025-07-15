from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from core.models import FilterSetting
from core.serializers.filter import FilterSettingSerializer

class FilterListCreateAPIView(APIView):
    """
    Handles listing and creating filter settings for the authenticated user.
    GET: List all filter settings for the user.
    POST: Create a new filter setting for the user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        filters = FilterSetting.objects.filter(user=request.user)
        serializer = FilterSettingSerializer(filters, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FilterSettingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class FilterDetailAPIView(APIView):
    """
    Handles retrieving, updating, and deleting a specific filter setting.
    GET: Retrieve a filter setting by ID.
    PUT: Update a filter setting by ID.
    DELETE: Delete a filter setting by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(FilterSetting, pk=pk, user=user)

    def get(self, request, pk):
        filt = self.get_object(pk, request.user)
        serializer = FilterSettingSerializer(filt)
        return Response(serializer.data)

    def put(self, request, pk):
        filt = self.get_object(pk, request.user)
        serializer = FilterSettingSerializer(filt, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        filt = self.get_object(pk, request.user)
        filt.delete()
        return Response(status=204)
