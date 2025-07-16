# core/views.py

import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from core.models import Deal,AnalysisResult
from core.serializers.deal import DealReadSerializer, DealWriteSerializer

class DealListCreateAPIView(APIView):
    """
    Handles listing and creating deals for the authenticated user.
    GET: List all deals for the user.
    POST: Create a new deal for the user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        deals = Deal.objects.filter(user=request.user).order_by('-created_at')
        
        for deal in deals:
            analaysis_result = AnalysisResult.objects.filter(deal=deal).first()
            
            deal.fetched_data = deal.fetched_data or {
                "bedrooms": 0,
                "bathrooms": 0,
                "sqft": random.randint(500, 5000),
                "price": random.randint(100000, 1000000),
                "zestimate": random.randint(100000, 1000000),
                "rent": random.randint(1000, 5000),
                "cap_rate": random.uniform(0.01, 0.1),
                "year_built": random.randint(1900, 2023),
            }
            deal.analysis_result = analaysis_result if analaysis_result else None
        serializer = DealReadSerializer(deals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DealWriteSerializer(data=request.data)
        if serializer.is_valid():
            
            deal = serializer.save(user=request.user)
            fetched_data = generate_property_data(city=deal.city, state=deal.state, street=deal.address, zip_code=deal.zip_code)
            if fetched_data:
                deal.fetched_data = fetched_data
                deal.save()
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

import google.generativeai as genai
import json

# Initialize Gemini model
genai.configure(api_key="AIzaSyCNkJytgcrFK8lCHvL0aJEkvgBlRlrSE1I")
model = genai.GenerativeModel("gemini-1.5-pro")

def generate_property_data(zip_code, street, city, state):
    prompt = f"""
    You are a real estate assistant.

    Generate realistic property data in JSON format for the property at:
    Street Address: {street}
    City: {city}
    State: {state}
    Zip Code: {zip_code}

    Include the following fields:
    - bedrooms (integer)
    - bathrooms (integer)
    - sqft (integer)
    - price (integer, USD)
    - rent (integer, USD)
    - cap_rate (float, between 0.01 and 0.12)
    - year_built (integer)

    Output JSON only, no explanation or formatting. Keep values realistic for that location.
    """

    try:
        response = model.generate_content(prompt)
        # Try to extract the JSON part
        content = response.text.strip()
        if "```" in content:
            # Remove Markdown code block if present
            content = content.split("```")[-2].strip()
        data = json.loads(content)
        return data
    except Exception as e:
        print("Gemini generation error:", e)
        return None
