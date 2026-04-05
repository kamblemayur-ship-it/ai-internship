/**
 * CORE ALLOCATION ALGORITHM (Simplified: 100% Skill-Driven)
 * Calculates the match percentage purely based on technical skill overlap.
 */

// Helper to normalize strings for comparison (e.g., "Node.js" -> "nodejs")
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const calculateMatchScore = (student, job) => {
  let totalScore = 0;
  let insights = [];

  // Check if both student and job have skills arrays
  if (student.skills && student.skills.length > 0 && job.skills && job.skills.length > 0) {
    
    // Create normalized arrays for the math
    const normalizedStudentSkills = student.skills.map(normalize);
    
    // Find matching skills, but keep the original formatting for the UI
    const originalMatchedSkills = job.skills.filter(jobSkill => 
      normalizedStudentSkills.includes(normalize(jobSkill))
    );
    
    const skillMatchRatio = originalMatchedSkills.length / job.skills.length;
    
    // Math: Skills are now 100% of the score. We cap it at 99%.
    totalScore = Math.min(Math.round((skillMatchRatio * 100)), 99);

    // Human-readable insights for the frontend
    if (skillMatchRatio === 1) {
      insights.push(`100% Technical Match (${originalMatchedSkills.join(', ')})`);
    } else if (skillMatchRatio >= 0.5) {
      insights.push(`Strong core alignment (${originalMatchedSkills.length}/${job.skills.length} skills matched)`);
    } else if (skillMatchRatio > 0) {
      insights.push(`Partial match. Missing ${job.skills.length - originalMatchedSkills.length} key requirements.`);
    } else {
      insights.push(`No overlapping technical skills.`);
    }

  } else {
    insights.push(`Insufficient data to calculate a technical match.`);
  }

  return {
    jobId: job._id,
    role: job.role,
    company: job.companyName,
    matchScore: totalScore,
    location: job.location,
    stipend: job.stipend,
    insights: insights
  };
};

/**
 * Runs the engine for a single student against all active jobs.
 */
const runEngineForStudent = (student, allJobs) => {
  // We no longer pass "systemWeights" because the engine is 100% skill-based
  const matches = allJobs.map(job => calculateMatchScore(student, job));
  
  // Sort from highest match score to lowest
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return only the top 5 matches
  return matches.slice(0, 5);
};

module.exports = {
  runEngineForStudent
};