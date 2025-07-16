# core/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from core.utils.analysis import run_full_analysis, extract_pdf_table_data
from core.models import Deal, AnalysisResult,UploadedDocument
from core.serializers.analasisResult import AnalysisResultSerializer, RecommendationsSerializer

class DealAnalyzeAPIView(APIView):
    """
    Handles analyzing a specific deal for the authenticated user.
    POST: Run AI-powered investment analysis and create/update analysis result for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)

        # Make sure fetched_data exists and contains what we need
        data = deal.fetched_data or {}

        # Define expected fields with fallbacks
        default_data = {
            "purchase_price": 1000000,
            "noi": 75000,
            "cash_invested": 250000,
            "annual_cash_flow": 20000,
            "cash_flows": [-250000, 20000, 22000, 25000, 800000],
            "bedrooms": 3,
            "bathrooms": 2,
            "sqft": 1200,
            "rent": 2500,
            "year_built": 1995,
            "crime_score": 5,
            "area_income": 60000,
        }

        # Merge default values with actual fetched_data
        analysis_input = {**default_data, **data}

        # Run full analysis using Gemini + Python logic
        t12_doc = UploadedDocument.objects.filter(deal=deal, doc_type='t12').first()
        t12_extracted = extract_pdf_table_data(t12_doc.file.path) if t12_doc else None
        rent_roll_doc = UploadedDocument.objects.filter(deal=deal, doc_type='rent_roll').first()
        
        rent_roll_extracted = extract_pdf_table_data(rent_roll_doc.file.path) if rent_roll_doc else None
        result = run_full_analysis(analysis_input,t12_data=t12_extracted, rent_roll_data=rent_roll_extracted)

        # Save to AnalysisResult
        analysis_result, created = AnalysisResult.objects.update_or_create(
            deal=deal,
            defaults={
                'cap_rate': result["summary"].get("cap_rate"),
                'cash_on_cash': result["summary"].get("cash_on_cash"),
                'irr': result["summary"].get("irr"),
                'pass_status': result["summary"].get("cap_rate", 0) > 0.06,  # Example logic
                'recommendations': result["ai_recommendations"].get("recommendations", []),
                'risk_score': result["risk_analysis"].get("risk_score"),
                'risk_flags': result["risk_analysis"].get("red_flags"),
            }
        )

        serializer = AnalysisResultSerializer(analysis_result)
        return Response(serializer.data, status=status.HTTP_200_OK)
class DealAnalysisResultAPIView(APIView):
    """
    Handles retrieving the analysis result for a specific deal.
    GET: Retrieve analysis result for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        analysis = get_object_or_404(AnalysisResult, deal__pk=pk, deal__user=request.user)
        serializer = AnalysisResultSerializer(analysis)
        return Response(serializer.data)


class DealRecommendationsAPIView(APIView):
    """
    Handles retrieving recommendations for a specific deal's analysis.
    GET: Retrieve recommendations for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        analysis = get_object_or_404(AnalysisResult, deal__pk=pk, deal__user=request.user)
        serializer = RecommendationsSerializer({'recommendations': analysis.recommendations})
        return Response(serializer.data)
