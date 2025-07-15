# core/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from core.models import Deal, AnalysisResult
from core.serializers.analasisResult import AnalysisResultSerializer, RecommendationsSerializer
from core.utils.underwrite import run_underwriting_logic

class DealAnalyzeAPIView(APIView):
    """
    Handles analyzing a specific deal for the authenticated user.
    POST: Run underwriting logic and create/update analysis result for a deal by ID."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)

        # Run underwriting logic
        result_data = run_underwriting_logic(deal)

        # Create or update AnalysisResult
        analysis_result, created = AnalysisResult.objects.update_or_create(
            deal=deal,
            defaults={
                'cap_rate': result_data['cap_rate'],
                'cash_on_cash': result_data['cash_on_cash'],
                'irr': result_data['irr'],
                'pass_status': result_data['pass_status'],
                'recommendations': result_data['recommendations'],
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
