from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    hr_name = serializers.SerializerMethodField()
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'hr_user', 'hr_name', 'title', 'department',
            'description', 'qualifications', 'skills', 'experience_years',
            'deadline', 'status', 'created_at', 'application_count',
        ]
        read_only_fields = ['id', 'hr_user', 'hr_name', 'created_at', 'application_count']

    def get_hr_name(self, obj):
        return obj.hr_user.get_full_name()

    def get_application_count(self, obj):
        return obj.applications.count()
