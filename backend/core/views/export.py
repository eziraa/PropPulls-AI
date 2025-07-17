
import os
import random
from tempfile import NamedTemporaryFile
from django.conf import settings
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from core.models import AnalysisResult, ExportedFile, Deal
from core.serializers.export import ExportedFileSerializer
from core.serializers.deal import DealReadSerializer
from core.utils.export import export_deals_to_excel, export_deals_to_pdf


class ExportListAPIView(APIView):
    """
    Handles listing all exported files for a specific deal.
    GET: List all exported files for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)
        exports = ExportedFile.objects.filter(deal=deal)
        serializer = ExportedFileSerializer(exports, many=True)
        return Response(serializer.data)


class ExportPDFAPIView(APIView):
    """
    Handles generating and exporting a PDF summary for a specific deal.
    GET: Generate and return a PDF summary for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        deals = Deal.objects.filter(user=request.user)
        if not deals.exists():
            return Response({"detail": "No deals found for the user."}, status=404)
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
        deals_data = DealReadSerializer(deals, many=True).data
        filename = generate_timestamp_filename("deal_report", "pdf")
        output_dir = os.path.join(settings.MEDIA_ROOT, "exports")
        os.makedirs(output_dir, exist_ok=True)

        file_path = os.path.join(output_dir, filename)
        export_deals_to_pdf(deals_data, pdf_path=file_path)

        file_url = f"{settings.BACKEND_URL}{settings.MEDIA_URL}exports/{filename}"
        return Response({
            "file_url": file_url,
            "message": "PDF exported successfully."
        })

class ExportExcelAPIView(APIView):
    """
    Handles generating and exporting an Excel summary for user deals.
    GET: Generate and return an Excel file of all user's deals.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        deals = Deal.objects.filter(user=request.user)
        if not deals.exists():
            return Response({"detail": "No deals found for the user."}, status=404)
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
        deals_data = DealReadSerializer(deals, many=True).data
        filename = generate_timestamp_filename("deal_report", "xlsx")
        output_dir = os.path.join(settings.MEDIA_ROOT, "exports")
        os.makedirs(output_dir, exist_ok=True)

        file_path = os.path.join(output_dir, filename)
        export_deals_to_excel(deals_data, excel_path=file_path)

        file_url = f"{settings.BACKEND_URL}{settings.MEDIA_URL}exports/{filename}"
        return Response({
            "file_url": file_url,
            "message": "Excel exported successfully."
        })
class ExportLOIAPIView(APIView):
    """
    Handles generating and exporting a Letter of Intent (LOI) for a specific deal.
    GET: Generate and return a LOI for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)
        file = None
        export = ExportedFile.objects.create(deal=deal, export_type='loi', file=file)
        return Response(ExportedFileSerializer(export).data)

from datetime import datetime

def generate_timestamp_filename(prefix: str, extension: str) -> str:
    timestamp = datetime.now().strftime("%d-%m-%Y-%H-%M-%S")
    return f"{prefix}_{timestamp}.{extension}"
