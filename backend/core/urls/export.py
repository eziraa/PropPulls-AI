# core/urls.py

from django.urls import path
from core.views.export import (
    ExportListAPIView,
    ExportPDFAPIView,
    ExportExcelAPIView,
    ExportLOIAPIView,
)

urlpatterns = [
    path('deals/<int:pk>/exports/', ExportListAPIView.as_view(), name='export-list'),
    path('deals/<int:pk>/export/pdf/', ExportPDFAPIView.as_view(), name='export-pdf'),
    path('deals/<int:pk>/export/excel/', ExportExcelAPIView.as_view(), name='export-excel'),
    path('deals/<int:pk>/export/loi/', ExportLOIAPIView.as_view(), name='export-loi'),
]
