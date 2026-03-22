from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from .models import Job
from .serializers import JobSerializer
from .permissions import IsHR


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # HR sees all their own jobs (open + closed); others see only open jobs
        if user.is_authenticated and user.role == 'hr':
            return Job.objects.filter(hr_user=user)
        return Job.objects.filter(status='open')

    def perform_create(self, serializer):
        serializer.save(hr_user=self.request.user)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsHR()]
        return [IsAuthenticatedOrReadOnly()]


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method in ['PATCH', 'PUT', 'DELETE']:
            return [IsHR()]
        return [IsAuthenticatedOrReadOnly()]

    def perform_destroy(self, instance):
        from rest_framework.exceptions import PermissionDenied
        if instance.hr_user != self.request.user:
            raise PermissionDenied('You can only delete your own jobs.')
        instance.delete()


@api_view(['GET'])
@permission_classes([IsHR])
def job_rankings(request, pk):
    try:
        job = Job.objects.get(pk=pk, hr_user=request.user)
    except Job.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    from apps.applications.models import Application, Score
    from apps.applications.serializers import RankingSerializer

    applications = (
        Application.objects
        .filter(job=job)
        .select_related('score')
        .order_by('-score__final_score')
    )
    serializer = RankingSerializer(applications, many=True, context={'request': request})
    return Response(serializer.data)
