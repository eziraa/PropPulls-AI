from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg
from core.models import Deal, AnalysisResult


class DashboardMetricsAPIView(APIView):
    """
    Provides key metrics for the user's dashboard.
    - Total deals created by the user.
    - Average cap rate of analyzed deals.
    - Count of deals that passed or failed analysis.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        total_deals = Deal.objects.filter(user=user).count()

        analysis_qs = AnalysisResult.objects.filter(deal__user=user)
        avg_cap_rate = analysis_qs.aggregate(avg_cap=Avg('cap_rate'))['avg_cap']
        pass_count = analysis_qs.filter(pass_status=True).count()
        fail_count = analysis_qs.filter(pass_status=False).count()

        return Response({
            'total_deals': total_deals,
            'average_cap_rate': round(avg_cap_rate or 0, 2),
            'pass_count': pass_count,
            'fail_count': fail_count,
        })


class DashboardRecentDealsAPIView(APIView):
    """
    Provides a list of recent deals analyzed by the user.
    Returns the last 5 deals with their analysis results.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        recent_analyses = (
            AnalysisResult.objects
            .filter(deal__user=user)
            .select_related('deal')
            .order_by('-created_at')[:5]
        )

        data = [
            {
                "deal_id": analysis.deal.id,
                "address": analysis.deal.address,
                "cap_rate": analysis.cap_rate,
                "pass_status": analysis.pass_status,
                "analyzed_on": analysis.created_at,
            }
            for analysis in recent_analyses
        ]

        return Response(data)
