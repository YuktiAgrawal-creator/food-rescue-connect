from rest_framework import serializers
from .models import Donation
from users.serializers import UserSerializer

class DonationSerializer(serializers.ModelSerializer):
    donor_details = UserSerializer(source='donor', read_only=True)
    organization_assigned_details = UserSerializer(source='organization_assigned', read_only=True)
    
    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ('donor', 'organization_assigned', 'status', 'created_at', 'updated_at')

    def validate(self, data):
        if not self.instance:
            address = data.get('address')
            if not address:
                raise serializers.ValidationError({"location": "A valid pickup address is required for new donations."})
        return data

    def create(self, validated_data):
        # Automatically set the donor to the current user
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['donor'] = request.user
        return super().create(validated_data)
