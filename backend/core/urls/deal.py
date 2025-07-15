from django.urls import path
from core.views.deal import DealListCreateAPIView, DealDetailAPIView, DealFetchDataAPIView

urlpatterns = [
    path('deals/', DealListCreateAPIView.as_view(), name='deal-list-create'),
    path('deals/<int:pk>/', DealDetailAPIView.as_view(), name='deal-detail'),
    path('deals/<int:pk>/fetch-data/', DealFetchDataAPIView.as_view(), name='deal-fetch-data'),
]
