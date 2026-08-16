from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PickupRequest
from .serializers import PickupRequestSerializer
from donations.models import Donation

class PickupRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PickupRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'DONOR':
            # Donors see pickups for their donations
            return PickupRequest.objects.filter(donation__donor=user)
        elif user.role == 'ORGANIZATION':
            # Organizations see pickups they made
            return PickupRequest.objects.filter(requester=user)
        return PickupRequest.objects.none()

    def create(self, request, *args, **kwargs):
        if request.user.role != 'ORGANIZATION':
            return Response({'detail': 'Only organizations can request pickups.'}, status=status.HTTP_403_FORBIDDEN)
        
        donation_id = request.data.get('donation')
        try:
            donation = Donation.objects.get(id=donation_id, status='AVAILABLE')
        except Donation.DoesNotExist:
            return Response({'detail': 'Donation not found or not available.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already requested
        if PickupRequest.objects.filter(donation=donation, requester=request.user, status='PENDING').exists():
            return Response({'detail': 'You already have a pending request for this donation.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update donation status
        donation.status = 'PENDING'
        donation.save()
        
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        pickup = self.get_object()
        if request.user.role != 'DONOR' or pickup.donation.donor != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        pickup.status = 'ACCEPTED'
        pickup.save()
        
        donation = pickup.donation
        donation.status = 'ACCEPTED'
        donation.organization_assigned = pickup.requester
        donation.save()
        
        # Reject other pending requests for this donation
        PickupRequest.objects.filter(donation=donation, status='PENDING').exclude(id=pickup.id).update(status='REJECTED')
        
        return Response({'status': 'Pickup accepted'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        pickup = self.get_object()
        if request.user.role != 'DONOR' or pickup.donation.donor != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        pickup.status = 'REJECTED'
        pickup.save()
        
        # If no other pending requests, set donation back to AVAILABLE
        if not PickupRequest.objects.filter(donation=pickup.donation, status='PENDING').exists():
            pickup.donation.status = 'AVAILABLE'
            pickup.donation.save()
            
        return Response({'status': 'Pickup rejected'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        pickup = self.get_object()
        if pickup.status != 'ACCEPTED':
            return Response({'detail': 'Only accepted pickups can be completed.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Only the requesting organization is allowed to complete the pickup
        if request.user.role != 'ORGANIZATION' or request.user != pickup.requester:
            return Response({'detail': 'Not authorized. Only the requesting organization can mark this pickup as completed.'}, status=status.HTTP_403_FORBIDDEN)
            
        pickup.status = 'COMPLETED'
        pickup.save()
        
        donation = pickup.donation
        donation.status = 'COMPLETED'
        donation.save()
        
        return Response({'status': 'Pickup completed'})
