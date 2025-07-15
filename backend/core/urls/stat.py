from django.urls import path
from core.views.stat import DashboardMetricsAPIView, DashboardRecentDealsAPIView

urlpatterns = [
    path('dashboard/metrics/', DashboardMetricsAPIView.as_view(), name='dashboard-metrics'),
    path('dashboard/recent/', DashboardRecentDealsAPIView.as_view(), name='dashboard-recent'),
]
