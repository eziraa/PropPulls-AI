
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from core.views.export import (
    ExportListAPIView,
    ExportPDFAPIView,
    ExportExcelAPIView,
    ExportLOIAPIView,
)

urlpatterns = [
    path('deals/<int:pk>/exports/', ExportListAPIView.as_view(), name='export-list'),
    path('deals/export/pdf/', ExportPDFAPIView.as_view(), name='export-pdf'),
    path('deals/export/excel/', ExportExcelAPIView.as_view(), name='export-excel'),
    path('deals/<int:pk>/export/loi/', ExportLOIAPIView.as_view(), name='export-loi'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
