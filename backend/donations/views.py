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
