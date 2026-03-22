from django.urls import path
from .views import JobListCreateView, JobDetailView, job_rankings

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/rankings/', job_rankings, name='job-rankings'),
]
