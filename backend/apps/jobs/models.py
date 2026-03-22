from django.db import models
from apps.users.models import User


class Job(models.Model):
    STATUS_CHOICES = [('open', 'Open'), ('closed', 'Closed')]

    hr_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    description = models.TextField()
    qualifications = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text='Comma-separated skills')
    experience_years = models.IntegerField(default=0)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.department}"
