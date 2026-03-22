from rest_framework import serializers
from .models import Application, Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = [
            'qualification_score', 'experience_score', 'skills_score',
            'cover_letter_score', 'overall_score', 'final_score',
            'summary', 'strengths', 'gaps', 'graded_at',
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    score = ScoreSerializer(read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_department = serializers.CharField(source='job.department', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'job_department', 'candidate_code',
            'cover_letter', 'resume_file', 'status', 'submitted_at', 'score',
        ]
        read_only_fields = ['id', 'candidate_code', 'status', 'submitted_at', 'score']


class ApplicationSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['job', 'cover_letter', 'resume_file']

    def validate_cover_letter(self, value):
        if len(value.strip()) < 100:
            raise serializers.ValidationError('Cover letter must be at least 100 characters.')
        return value

    def validate_resume_file(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('Resume file must be under 5MB.')
        name = value.name.lower()
        if not (name.endswith('.pdf') or name.endswith('.docx')):
            raise serializers.ValidationError('Only PDF and DOCX files are accepted.')
        return value


class RankingSerializer(serializers.ModelSerializer):
    score = ScoreSerializer(read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'candidate_code', 'job_title', 'status', 'submitted_at', 'score',
        ]
