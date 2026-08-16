import math
from rest_framework import viewsets, permissions, filters
from django.db.models import F, ExpressionWrapper, FloatField
from django_filters.rest_framework import DjangoFilterBackend
from .models import Donation
from .serializers import DonationSerializer
from users.permissions import IsDonor, IsOrganization

class DonationViewSet(viewsets.ModelViewSet):
    serializer_class = DonationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'food_category']
    search_fields = ['title', 'description', 'donor__organization_name']
    ordering_fields = ['created_at', 'expires_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsDonor()]
        return [permissions.IsAuthenticated()] # Anyone authenticated can view

    def get_queryset(self):
        user = self.request.user
        queryset = Donation.objects.all()

        # Filtering logic
        if self.action == 'list':
            # Donors see their own, organizations see AVAILABLE
            if user.role == 'DONOR':
                queryset = queryset.filter(donor=user)
            elif user.role == 'ORGANIZATION':
                queryset = queryset.filter(status='AVAILABLE')

            # Haversine Distance Filtering (radius in km)
            lat = self.request.query_params.get('lat')
            lon = self.request.query_params.get('lon')
            radius = self.request.query_params.get('radius')
            
            if lat and lon and radius:
                try:
                    lat = float(lat)
                    lon = float(lon)
                    radius = float(radius)
                    # Note: A real geospatial query requires PostGIS.
                    # For standard PostgreSQL, we can use a raw SQL filter or a bounding box for efficiency, 
                    # but here we'll keep it simple by filtering in python for the prototype, 
                    # or returning all and letting frontend filter, or implementing a custom raw query.
                    # To keep it robust without extra DB extensions:
                    valid_ids = []
                    for donation in queryset:
                        if donation.latitude is not None and donation.longitude is not None:
                            # Haversine calculation
                            R = 6371.0 # Earth radius in km
                            dlat = math.radians(donation.latitude - lat)
                            dlon = math.radians(donation.longitude - lon)
                            a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat)) * math.cos(math.radians(donation.latitude)) * math.sin(dlon / 2)**2
                            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                            distance = R * c
                            if distance <= radius:
                                valid_ids.append(donation.id)
                    queryset = queryset.filter(id__in=valid_ids)
                except ValueError:
                    pass # Ignore invalid lat/lon parameters

        return queryset

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from django.contrib.auth import get_user_model
from pickups.models import PickupRequest

User = get_user_model()

class AnalyticsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        total_donations = Donation.objects.count()
        completed_pickups = PickupRequest.objects.filter(status='COMPLETED').count()
        
        active_donors = User.objects.filter(role='DONOR', donations_made__isnull=False).distinct().count()
        active_orgs = User.objects.filter(role='ORGANIZATION', pickup_requests_made__isnull=False).distinct().count()
        
        # Rescue Progress
        rescued_donations = Donation.objects.filter(pickup_requests__status='COMPLETED').distinct()
        rescued_donations_count = rescued_donations.count()
        
        # Completed Food Breakdown by ACTUAL unit
        breakdown_dict = {}
        for d in rescued_donations:
            try:
                val = float(d.quantity)
            except (ValueError, TypeError):
                continue
                
            unit = str(d.unit).strip().lower() if d.unit else 'unknown'
            if not unit:
                unit = 'unknown'
                
            if unit in breakdown_dict:
                breakdown_dict[unit] += val
            else:
                breakdown_dict[unit] = val
                
        completed_breakdown = [
            {"unit": unit, "quantity": round(qty, 2) if qty % 1 != 0 else int(qty)}
            for unit, qty in breakdown_dict.items()
        ]
        
        return Response({
            'total_donations': total_donations,
            'completed_pickups': completed_pickups,
            'food_donors': active_donors,
            'partner_organizations': active_orgs,
            'completed_breakdown': completed_breakdown,
            'rescue_progress': {
                'created_donations': total_donations,
                'rescued_donations': rescued_donations_count
            }
        })
