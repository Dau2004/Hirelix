"""
Free local grading engine using spaCy + scikit-learn.
No API calls, works fully offline.
"""
import re
import numpy as np

_nlp = None


def _get_nlp():
    global _nlp
    if _nlp is None:
        import spacy
        _nlp = spacy.load('en_core_web_md')
    return _nlp


def _similarity(text_a: str, text_b: str) -> float:
    """Cosine similarity between two texts using spaCy vectors."""
    nlp = _get_nlp()
    doc_a = nlp(text_a[:10000])
    doc_b = nlp(text_b[:10000])
    if not doc_a.has_vector or not doc_b.has_vector:
        return 0.0
    return float(doc_a.similarity(doc_b))


def _extract_years(text: str) -> float:
    """Extract first mentioned years-of-experience from text."""
    patterns = [
        r'(\d+)\+?\s*years?\s+of\s+experience',
        r'(\d+)\+?\s*years?\s+experience',
        r'experience\s+of\s+(\d+)\+?\s*years?',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return float(match.group(1))
    return 0.0


def _skill_overlap(required_skills: list[str], full_text: str) -> float:
    """Fraction of required skills found in full_text (case-insensitive)."""
    if not required_skills:
        return 0.75
    text_lower = full_text.lower()
    matched = sum(1 for s in required_skills if s.lower().strip() in text_lower)
    return matched / len(required_skills)


def _score_to_100(value: float, scale: float = 1.0) -> int:
    return min(100, int(value * 100 * scale))


def grade(job, application) -> dict:
    """
    Grade an application against a job.
    Returns dict with all score fields.
    """
    # Prepare texts
    jd_text = f"{job.title} {job.department} {job.description} {job.qualifications} {job.skills}"
    resume_text = application.resume_text or ''
    cover_letter = application.cover_letter or ''
    full_app_text = f"{resume_text} {cover_letter}"

    required_skills = [s.strip() for s in job.skills.split(',') if s.strip()] if job.skills else []

    # 1. Qualification score — semantic similarity JD qualifications vs resume
    qual_sim = _similarity(job.qualifications or job.description, resume_text or 'none')
    qualification_score = _score_to_100(qual_sim, scale=1.2)

    # 2. Experience score
    required_years = float(job.experience_years or 0)
    extracted_years = _extract_years(full_app_text)
    if required_years == 0:
        experience_score = 75
    else:
        ratio = min(extracted_years / required_years, 1.5)
        experience_score = int(ratio * 100 / 1.5)

    # 3. Skills score — keyword overlap
    skill_frac = _skill_overlap(required_skills, full_app_text)
    skills_score = _score_to_100(skill_frac)

    # 4. Cover letter score — semantic similarity JD vs cover letter
    cl_sim = _similarity(jd_text, cover_letter or 'none')
    cover_letter_score = _score_to_100(cl_sim, scale=1.3)

    # 5. Overall score — full JD vs full application
    overall_sim = _similarity(jd_text, full_app_text or 'none')
    overall_score = _score_to_100(overall_sim, scale=1.2)

    # Weighted final score
    final_score = (
        qualification_score * 0.25 +
        experience_score * 0.25 +
        skills_score * 0.25 +
        cover_letter_score * 0.15 +
        overall_score * 0.10
    )
    final_score = round(min(100.0, final_score), 2)

    # Summary & strengths/gaps
    strengths = []
    gaps = []

    if qualification_score >= 70:
        strengths.append('Strong educational/professional qualifications')
    else:
        gaps.append('Qualifications do not closely match job requirements')

    if experience_score >= 70:
        strengths.append(f'Meets experience requirement ({int(extracted_years)} years found)')
    else:
        gaps.append(f'Experience may be insufficient (requires {int(required_years)} years)')

    if skills_score >= 70:
        strengths.append('Good skill coverage for the role')
    else:
        missing = [s for s in required_skills if s.lower() not in full_app_text.lower()]
        if missing:
            gaps.append(f'Missing skills: {", ".join(missing[:5])}')
        else:
            gaps.append('Skills section needs improvement')

    if cover_letter_score >= 70:
        strengths.append('Cover letter is well-aligned with the job description')
    else:
        gaps.append('Cover letter does not address key requirements')

    if final_score >= 80:
        label = 'Excellent'
    elif final_score >= 65:
        label = 'Good'
    elif final_score >= 50:
        label = 'Fair'
    else:
        label = 'Weak'

    summary = (
        f"Overall rating: {label}. "
        f"Final score: {final_score}/100. "
        f"Qualification: {qualification_score}, Experience: {experience_score}, "
        f"Skills: {skills_score}, Cover Letter: {cover_letter_score}."
    )

    return {
        'qualification_score': qualification_score,
        'experience_score': experience_score,
        'skills_score': skills_score,
        'cover_letter_score': cover_letter_score,
        'overall_score': overall_score,
        'final_score': final_score,
        'summary': summary,
        'strengths': strengths,
        'gaps': gaps,
    }
