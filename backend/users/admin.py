from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username',
        'email',
        'role',
        'organization_name',
        'is_active',
        'is_staff',
        'is_superuser',
    )

    list_filter = (
        'role',
        'is_active',
        'is_staff',
        'is_superuser',
    )

    search_fields = (
        'username',
        'email',
        'first_name',
        'last_name',
        'organization_name',
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            'Food Rescue Connect Information',
            {
                'fields': (
                    'role',
                    'phone',
                    'organization_name',
                    'address',
                    'city',
                    'state',
                    'latitude',
                    'longitude',
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            'Food Rescue Connect Information',
            {
                'fields': (
                    'role',
                    'phone',
                    'organization_name',
                    'address',
                    'city',
                    'state',
                    'latitude',
                    'longitude',
                )
            },
        ),
    )