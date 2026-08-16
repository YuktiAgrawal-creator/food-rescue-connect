from users.models import User

try:
    user = User.objects.get(username='freshbites')
    print("USER_FOUND: freshbites")
    print(f"Password hash: {user.password}")
    print(f"Has usable password? {user.has_usable_password()}")
except User.DoesNotExist:
    pass
