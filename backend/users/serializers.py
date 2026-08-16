from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 
                  'organization_name', 'address', 'city', 'state', 'latitude', 'longitude')
        read_only_fields = ('id', 'role')

import re
from django.core.validators import validate_email as django_validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'first_name', 'last_name', 'organization_name')
        extra_kwargs = {
            'organization_name': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'email': {'required': True, 'allow_blank': False}
        }

    def validate_first_name(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("First name is required.")
        if len(val) < 2 or len(val) > 50:
            raise serializers.ValidationError("First name must contain at least 2 characters.")
        if not re.match(r"^[A-Za-z\s\-]+$", val):
            raise serializers.ValidationError("First name can contain only letters.")
        return val

    def validate_last_name(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Last name is required.")
        if len(val) < 2 or len(val) > 50:
            raise serializers.ValidationError("Last name must contain at least 2 characters.")
        if not re.match(r"^[A-Za-z\s\-]+$", val):
            raise serializers.ValidationError("Last name can contain only letters.")
        return val

    def validate_organization_name(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Please enter a valid organization name.")
        if len(val) < 2 or len(val) > 100:
            raise serializers.ValidationError("Please enter a valid organization name.")
        if not re.match(r"^[A-Za-z0-9\s&.\-']+$", val):
            raise serializers.ValidationError("Please enter a valid organization name.")
        if not re.search(r"[A-Za-z]", val):
            raise serializers.ValidationError("Please enter a valid organization name.")
        return val

    def validate_username(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Username is required.")
        if len(val) < 3 or len(val) > 30:
            raise serializers.ValidationError("Username may contain only letters, numbers and underscores.")
        if not re.match(r"^[A-Za-z0-9_]+$", val):
            raise serializers.ValidationError("Username may contain only letters, numbers and underscores.")
        user_qs = User.objects.filter(username=val)
        if user_qs.exists():
            if not user_qs.first().is_active:
                raise serializers.ValidationError("An account with this username already exists but is inactive. Please contact the administrator or reactivate your existing account.")
            raise serializers.ValidationError("This username is already taken.")
        return val

    def validate_email(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Please enter a valid email address.")
        try:
            django_validate_email(val)
        except DjangoValidationError:
            raise serializers.ValidationError("Please enter a valid email address.")
        user_qs = User.objects.filter(email=val)
        if user_qs.exists():
            if not user_qs.first().is_active:
                raise serializers.ValidationError("An account with this email already exists but is inactive. Please contact the administrator or reactivate your existing account.")
            raise serializers.ValidationError("This email is already in use.")
        return val

    def validate_role(self, value):
        if value not in ['DONOR', 'ORGANIZATION']:
            raise serializers.ValidationError("Role must be either DONOR or ORGANIZATION")
        return value

    def validate(self, data):
        password = data.get('password', '')

        if len(password) < 8 or len(password) > 128:
            raise serializers.ValidationError({"password": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."})

        if not re.search(r"[A-Z]", password) or not re.search(r"[a-z]", password) or not re.search(r"[0-9]", password) or not re.search(r"[^A-Za-z0-9]", password):
            raise serializers.ValidationError({"password": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."})

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data['role'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            organization_name=validated_data.get('organization_name', '')
        )
        return user
