from django.urls import path
from core.views.document import (
    DocumentUploadAPIView,
    DealDocumentsAPIView,
    DocumentDetailAPIView
)

urlpatterns = [
    path('deals/<int:pk>/documents/', DocumentUploadAPIView.as_view(), name='document-upload'),
    path('deals/<int:pk>/documents/', DealDocumentsAPIView.as_view(), name='document-list'),
    path('documents/<int:doc_id>/', DocumentDetailAPIView.as_view(), name='document-detail'),
    path('documents/<int:doc_id>/delete/', DocumentDetailAPIView.as_view(), name='document-delete'),
]
