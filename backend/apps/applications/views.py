from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.permissions import IsApplicant
from .models import Application, Score
from .serializers import ApplicationSerializer, ApplicationSubmitSerializer


@api_view(['POST'])
@permission_classes([IsApplicant])
@parser_classes([MultiPartParser, FormParser])
def submit_application(request):
    serializer = ApplicationSubmitSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    job = serializer.validated_data['job']

    # Check duplicate
    if Application.objects.filter(job=job, applicant=request.user).exists():
        return Response({'detail': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

    application = serializer.save(applicant=request.user)

    # Extract resume text
    from apps.grading.utils import extract_text_from_file
    application.resume_text = extract_text_from_file(application.resume_file)
    application.save()

    # Grade application
    from apps.grading.engine import grade
    result = grade(job, application)

    Score.objects.create(
        application=application,
        qualification_score=result['qualification_score'],
        experience_score=result['experience_score'],
        skills_score=result['skills_score'],
        cover_letter_score=result['cover_letter_score'],
        overall_score=result['overall_score'],
        final_score=result['final_score'],
        summary=result['summary'],
        strengths=result['strengths'],
        gaps=result['gaps'],
    )

    application.status = 'graded'
    application.save()

    return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    applications = Application.objects.filter(applicant=request.user).select_related('score', 'job')
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_detail(request, pk):
    try:
        if request.user.role == 'hr':
            application = Application.objects.get(pk=pk, job__hr_user=request.user)
        else:
            application = Application.objects.get(pk=pk, applicant=request.user)
    except Application.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(ApplicationSerializer(application).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    from apps.jobs.permissions import IsHR
    if request.user.role != 'hr':
        return Response({'detail': 'Only HR can update application status.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        application = Application.objects.get(pk=pk, job__hr_user=request.user)
    except Application.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in ['graded', 'under_review', 'shortlisted', 'rejected']:
        return Response({'detail': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    application.status = new_status
    application.save()

    return Response(ApplicationSerializer(application).data)
