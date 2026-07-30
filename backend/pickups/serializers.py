from rest_framework import serializers
from .models import PickupRequest
from donations.serializers import DonationSerializer
from users.serializers import UserSerializer

class PickupRequestSerializer(serializers.ModelSerializer):
    requester_details = UserSerializer(source='requester', read_only=True)
    donation_details = DonationSerializer(source='donation', read_only=True)
    
    class Meta:
        model = PickupRequest
        fields = '__all__'
        read_only_fields = ('requester', 'status', 'created_at', 'updated_at')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['requester'] = request.user
        return super().create(validated_data)
