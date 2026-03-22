import uuid
from django.db import models
from apps.users.models import User
from apps.jobs.models import Job


def generate_candidate_code():
    return 'HLX-' + uuid.uuid4().hex[:6].upper()


class Application(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    candidate_code = models.CharField(max_length=20, unique=True, default=generate_candidate_code)
    cover_letter = models.TextField()
    resume_file = models.FileField(upload_to='resumes/%Y/%m/')
    resume_text = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('job', 'applicant')]
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.candidate_code} — {self.job.title}"


class Score(models.Model):
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='score')
    qualification_score = models.IntegerField(default=0)
    experience_score = models.IntegerField(default=0)
    skills_score = models.IntegerField(default=0)
    cover_letter_score = models.IntegerField(default=0)
    overall_score = models.IntegerField(default=0)
    final_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    summary = models.TextField(blank=True)
    strengths = models.JSONField(default=list)
    gaps = models.JSONField(default=list)
    graded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Score for {self.application.candidate_code}: {self.final_score}"
