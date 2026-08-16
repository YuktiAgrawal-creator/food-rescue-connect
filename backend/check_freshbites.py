from users.models import User

try:
    user = User.objects.get(username='freshbites')
    print("USER_FOUND: freshbites (by username)")
    print(f"id: {user.id}")
    print(f"username: {user.username}")
    print(f"email: {user.email}")
    print(f"role: {user.role}")
    print(f"is_active: {user.is_active}")
    print(f"is_staff: {user.is_staff}")

    if not user.is_active:
        print("Reactivating freshbites...")
        user.is_active = True
        user.save()
        print("freshbites is now active.")

except User.DoesNotExist:
    print("freshbites not found by username. Trying email...")
    try:
        user = User.objects.get(email='freshbites.demo@gmail.com')
        print("USER_FOUND: freshbites (by email)")
        print(f"id: {user.id}")
        print(f"username: {user.username}")
        print(f"email: {user.email}")
        print(f"role: {user.role}")
        print(f"is_active: {user.is_active}")

        if not user.is_active:
            print("Reactivating freshbites...")
            user.is_active = True
            user.save()
            print("freshbites is now active.")

    except User.DoesNotExist:
        print("freshbites not found by email either.")
