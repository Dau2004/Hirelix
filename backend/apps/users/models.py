from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('applicant', 'Applicant'),
        ('hr', 'HR'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='applicant')

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
