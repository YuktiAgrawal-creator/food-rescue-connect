from users.models import User

try:
    user = User.objects.get(username='Ananya')
    print("USER_FOUND: Ananya")
    print(f"username: {user.username}")
    print(f"email: {user.email}")
    print(f"first_name: {user.first_name}")
    print(f"last_name: {user.last_name}")
    print(f"organization_name: {user.organization_name}")
    print(f"role: {user.role}")
    print(f"is_staff: {user.is_staff}")
    print(f"is_superuser: {user.is_superuser}")

    # Fix it if wrong
    if user.role != 'ORGANIZATION':
        print(f"Changing role from {user.role} to ORGANIZATION")
        user.role = 'ORGANIZATION'
        user.save()
        print(f"Role updated successfully to {user.role}")
except User.DoesNotExist:
    # Try finding by org name
    try:
        user = User.objects.get(organization_name__icontains='Helping')
        print("USER_FOUND: by org name")
        print(f"username: {user.username}")
        print(f"email: {user.email}")
        print(f"organization_name: {user.organization_name}")
        print(f"role: {user.role}")

        if user.role != 'ORGANIZATION':
            print(f"Changing role from {user.role} to ORGANIZATION")
            user.role = 'ORGANIZATION'
            user.save()
            print(f"Role updated successfully to {user.role}")
    except Exception as e:
        print(f"Could not find user: {e}")
