from django.urls import path
from core.views.analusisResult import (
    DealAnalyzeAPIView,
    DealAnalysisResultAPIView,
    DealRecommendationsAPIView,
)

urlpatterns = [
    path('deals/<int:pk>/analyze/', DealAnalyzeAPIView.as_view(), name='deal-analyze'),
    path('deals/<int:pk>/analysis/', DealAnalysisResultAPIView.as_view(), name='deal-analysis-result'),
    path('deals/<int:pk>/recommendations/', DealRecommendationsAPIView.as_view(), name='deal-recommendations'),
]
