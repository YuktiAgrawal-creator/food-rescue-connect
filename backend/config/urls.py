from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from donations.views import AnalyticsView

def health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "CORS fix deployed",
        "version": "1.0.1"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/auth/', include('users.urls')),
    path('api/donations/', include('donations.urls')),
    path('api/pickups/', include('pickups.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/analytics/', AnalyticsView.as_view(), name='analytics'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
