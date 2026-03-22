from django.contrib import admin
from .models import Application, Score


class ScoreInline(admin.StackedInline):
    model = Score
    extra = 0
    readonly_fields = ['graded_at']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['candidate_code', 'job', 'status', 'submitted_at']
    list_filter = ['status', 'job']
    readonly_fields = ['candidate_code', 'submitted_at', 'resume_text']
    inlines = [ScoreInline]


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ['application', 'final_score', 'graded_at']
    readonly_fields = ['graded_at']
