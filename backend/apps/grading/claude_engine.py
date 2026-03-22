"""
Optional Claude API grading engine.
Drop-in replacement for engine.py.
Switch in applications/views.py:
    from apps.grading.claude_engine import grade
"""
import json
import anthropic
from decouple import config


def grade(job, application) -> dict:
    client = anthropic.Anthropic(api_key=config('ANTHROPIC_API_KEY'))

    prompt = f"""You are an expert HR analyst for Uganda's public sector. Grade this job application.

JOB:
Title: {job.title}
Department: {job.department}
Description: {job.description}
Qualifications: {job.qualifications}
Required Skills: {job.skills}
Min Experience: {job.experience_years} years

APPLICATION:
Resume:
{application.resume_text[:3000]}

Cover Letter:
{application.cover_letter[:1500]}

Score each dimension 0-100. Return ONLY valid JSON with these exact keys:
{{
  "qualification_score": <int 0-100>,
  "experience_score": <int 0-100>,
  "skills_score": <int 0-100>,
  "cover_letter_score": <int 0-100>,
  "overall_score": <int 0-100>,
  "final_score": <float 0-100, weighted: qual 25% + exp 25% + skills 25% + cl 15% + overall 10%>,
  "summary": "<2-3 sentence summary>",
  "strengths": ["<strength1>", "<strength2>"],
  "gaps": ["<gap1>", "<gap2>"]
}}"""

    message = client.messages.create(
        model='claude-haiku-4-5-20251001',
        max_tokens=600,
        messages=[{'role': 'user', 'content': prompt}],
    )

    result = json.loads(message.content[0].text)

    # Ensure required fields exist with defaults
    defaults = {
        'qualification_score': 0, 'experience_score': 0, 'skills_score': 0,
        'cover_letter_score': 0, 'overall_score': 0, 'final_score': 0.0,
        'summary': '', 'strengths': [], 'gaps': [],
    }
    return {**defaults, **result}
