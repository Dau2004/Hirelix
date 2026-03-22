from django.urls import path
from .views import submit_application, my_applications, application_detail, update_application_status

urlpatterns = [
    path('', submit_application, name='submit-application'),
    path('mine/', my_applications, name='my-applications'),
    path('<int:pk>/', application_detail, name='application-detail'),
    path('<int:pk>/status/', update_application_status, name='update-application-status'),
]
