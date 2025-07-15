
from django.urls import path
from core.views.filter import FilterListCreateAPIView, FilterDetailAPIView

urlpatterns = [
    path('filters/', FilterListCreateAPIView.as_view(), name='filter-list-create'),
    path('filters/<int:pk>/', FilterDetailAPIView.as_view(), name='filter-detail'),
]
