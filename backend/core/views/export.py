
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from core.models import ExportedFile, Deal
from core.serializers.export import ExportedFileSerializer
from core.utils.export import generate_pdf_summary, generate_excel_model, generate_loi


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

    def get(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)
        file = generate_pdf_summary(deal)
        export = ExportedFile.objects.create(deal=deal, export_type='pdf', file=file)
        return Response(ExportedFileSerializer(export).data)


class ExportExcelAPIView(APIView):
    """
    Handles generating and exporting an Excel model for a specific deal.
    GET: Generate and return an Excel model for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)
        file = generate_excel_model(deal)
        export = ExportedFile.objects.create(deal=deal, export_type='excel', file=file)
        return Response(ExportedFileSerializer(export).data)


class ExportLOIAPIView(APIView):
    """
    Handles generating and exporting a Letter of Intent (LOI) for a specific deal.
    GET: Generate and return a LOI for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)
        file = generate_loi(deal)
        export = ExportedFile.objects.create(deal=deal, export_type='loi', file=file)
        return Response(ExportedFileSerializer(export).data)
