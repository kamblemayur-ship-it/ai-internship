/**
 * CORE ALLOCATION ALGORITHM
 * Calculates the match percentage between a single student and a list of jobs.
 */

// Helper to normalize strings for comparison (removes spaces, makes lowercase)
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const calculateMatchScore = (student, job, weights) => {
  let totalScore = 0;
  let insights = [];

  // 1. SKILL MATCHING (Heaviest Weight - Default 70%)
  if (student.skills && student.skills.length > 0 && job.skills && job.skills.length > 0) {
    const studentSkills = student.skills.map(normalize);
    const jobSkills = job.skills.map(normalize);
    
    // Find intersection (skills they both have)
    const matchedSkills = studentSkills.filter(skill => jobSkills.includes(skill));
    
    const skillMatchRatio = matchedSkills.length / jobSkills.length;
    const skillScore = skillMatchRatio * weights.skills;
    totalScore += skillScore;

    if (skillMatchRatio === 1) {
      insights.push(`100% Skill Overlap (${matchedSkills.join(', ')})`);
    } else if (skillMatchRatio > 0.5) {
      insights.push(`Strong core skill alignment (${matchedSkills.length}/${jobSkills.length} required skills)`);
    } else {
      insights.push(`Missing key technical requirements. Upskilling recommended.`);
    }
  } else {
      insights.push(`Insufficient skill data for accurate technical matching.`);
  }

  // 2. LOCATION MATCHING (Default 20%)
  // Assuming student.location is a string of preferred cities, and job.location is a string
  if (student.location && job.location) {
    const prefLocations = student.location.split(',').map(normalize);
    const jobLoc = normalize(job.location);
    
    if (jobLoc === 'remote' || prefLocations.includes(jobLoc)) {
      totalScore += weights.location;
      insights.push(`Location perfectly aligns (${job.location})`);
    } else {
      insights.push(`Location mismatch. Job is in ${job.location}, preference is ${student.location}`);
    }
  }

  // 3. AVAILABILITY / DURATION MATCHING (Default 10%)
  if (student.duration && job.duration) {
    if (normalize(student.duration) === normalize(job.duration)) {
      totalScore += weights.availability;
      insights.push(`Duration requirement met (${job.duration})`);
    }
  }

  // Cap at 99% because no algorithm is perfect
  const finalScore = Math.min(Math.round(totalScore), 99);

  return {
    jobId: job._id,
    role: job.role,
    company: job.companyName,
    matchScore: finalScore,
    location: job.location,
    stipend: job.stipend,
    insights: insights
  };
};

/**
 * Runs the engine for a single student against all active jobs.
 */
const runEngineForStudent = (student, allJobs, systemWeights) => {
  const matches = allJobs.map(job => calculateMatchScore(student, job, systemWeights));
  
  // Sort from highest match score to lowest
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return the top 5 highest probability matches
  return matches.slice(0, 5);
};

module.exports = {
  runEngineForStudent
};