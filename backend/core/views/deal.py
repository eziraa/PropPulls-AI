# core/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from core.models import Deal
from core.serializers.deal import DealReadSerializer, DealWriteSerializer

class DealListCreateAPIView(APIView):
    """
    Handles listing and creating deals for the authenticated user.
    GET: List all deals for the user.
    POST: Create a new deal for the user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        deals = Deal.objects.filter(user=request.user)
        serializer = DealReadSerializer(deals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DealWriteSerializer(data=request.data)
        if serializer.is_valid():
            deal = serializer.save(user=request.user)
            return Response(DealReadSerializer(deal).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DealDetailAPIView(APIView):
    """
    Handles retrieving, updating, and deleting a specific deal for the authenticated user.
    GET: Retrieve a deal by ID.
    PUT: Update a deal by ID.
    DELETE: Delete a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Deal, pk=pk, user=user)

    def get(self, request, pk):
        deal = self.get_object(pk, request.user)
        serializer = DealReadSerializer(deal)
        return Response(serializer.data)

    def put(self, request, pk):
        deal = self.get_object(pk, request.user)
        serializer = DealWriteSerializer(deal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(DealReadSerializer(deal).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        deal = self.get_object(pk, request.user)
        deal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DealFetchDataAPIView(APIView):
    """
    Handles fetching external data for a specific deal.
    POST: Fetch data for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)

        # Mocked external fetch
        fetched_data = {
            "bedrooms": 3,
            "bathrooms": 2,
            "sqft": 1800,
            "zestimate": 350000
        }

        deal.fetched_data = fetched_data
        deal.save()

        return Response({
            "message": "Data fetched successfully.",
            "fetched_data": fetched_data
        })
