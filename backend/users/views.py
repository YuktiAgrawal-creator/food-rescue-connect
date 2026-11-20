from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from .serializers import RegisterSerializer, UserSerializer
from donations.models import Donation
from pickups.models import PickupRequest

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class DashboardView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = request.user
        data = {}

        if user.role == 'DONOR':
            data['total_donations'] = Donation.objects.filter(donor=user).count()
            data['available_donations'] = Donation.objects.filter(donor=user, status='AVAILABLE').count()
            data['pending_requests'] = PickupRequest.objects.filter(donation__donor=user, status='PENDING').count()
            data['completed_donations'] = Donation.objects.filter(donor=user, status='COMPLETED').count()
            
            # Additional stats could be aggregated here (e.g., total weight)
            
        elif user.role == 'ORGANIZATION':
            data['pending_requests'] = PickupRequest.objects.filter(requester=user, status='PENDING').count()
            data['accepted_pickups'] = PickupRequest.objects.filter(requester=user, status='ACCEPTED').count()
            data['completed_pickups'] = PickupRequest.objects.filter(requester=user, status='COMPLETED').count()
            data['available_food_global'] = Donation.objects.filter(status='AVAILABLE').count()

        elif user.role == 'ADMIN':
            data['total_users'] = User.objects.count()
            data['total_donors'] = User.objects.filter(role='DONOR').count()
            data['total_organizations'] = User.objects.filter(role='ORGANIZATION').count()
            data['total_donations'] = Donation.objects.count()
            data['active_donations'] = Donation.objects.filter(status='AVAILABLE').count()
            data['total_pickups'] = PickupRequest.objects.count()
            data['completed_pickups'] = PickupRequest.objects.filter(status='COMPLETED').count()

        return Response(data)

class AdminUserListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.role != 'ADMIN':
            return User.objects.none()
        return User.objects.all().order_by('-date_joined')

class DBHealthCheckView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                row = cursor.fetchone()

            table_names = connection.introspection.table_names()
            has_user_table = 'users_user' in table_names
            user_count = User.objects.count() if has_user_table else 0

            return Response({
                "status": "ok",
                "database": "connected",
                "has_users_table": has_user_table,
                "user_count": user_count,
            })
        except Exception as e:
            return Response({
                "status": "error",
                "database": "disconnected",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
