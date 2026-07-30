from rest_framework import permissions

class IsDonor(permissions.BasePermission):
    """
    Allows access only to Donor users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'DONOR')

class IsOrganization(permissions.BasePermission):
    """
    Allows access only to Organization users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ORGANIZATION')

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.donor == request.user # Assumes object has a 'donor' attribute
