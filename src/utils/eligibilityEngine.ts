import { Scholarship, StudentProfile, EligibilityEvaluation, VaultDocument } from '../types/scholarship';

export function evaluateEligibility(
  scholarship: Scholarship,
  profile: StudentProfile
): EligibilityEvaluation {
  const rules = scholarship.eligibilityRules;
  const checks: EligibilityEvaluation['checks'] = [];
  const missingRequirements: string[] = [];
  const qualifications: string[] = [];

  let totalWeight = 0;
  let earnedScore = 0;
  let hasHardFailure = false;

  // 1. Education Level Check (Weight: 25)
  totalWeight += 25;
  const eduLevelPassed = rules.educationLevels.includes(profile.educationLevel);
  if (eduLevelPassed) {
    earnedScore += 25;
    qualifications.push(`Degree level matches: You are in ${profile.educationLevel} study.`);
    checks.push({
      criterion: 'Education Level',
      studentValue: profile.educationLevel,
      requiredValue: rules.educationLevels.join(', '),
      passed: true,
      isMandatory: true,
      reason: `Matches required educational level (${profile.educationLevel}).`
    });
  } else {
    hasHardFailure = true;
    missingRequirements.push(`Requires enrollment in: ${rules.educationLevels.join(' or ')}. Your profile indicates ${profile.educationLevel}.`);
    checks.push({
      criterion: 'Education Level',
      studentValue: profile.educationLevel,
      requiredValue: rules.educationLevels.join(', '),
      passed: false,
      isMandatory: true,
      reason: `Scholarship is strictly reserved for ${rules.educationLevels.join(', ')} students.`
    });
  }

  // 2. Academic Merit / CGPA Check (Weight: 25)
  totalWeight += 25;
  const minCgpa = rules.minCgpaOrPercentage ?? 5.0;
  const studentCgpa = typeof profile.cgpa === 'number' 
    ? profile.cgpa 
    : typeof (profile as any).cgpaOrPercentage === 'number'
      ? (profile as any).cgpaOrPercentage
      : 7.0;

  const cgpaPassed = studentCgpa >= minCgpa;
  if (cgpaPassed) {
    earnedScore += 25;
    qualifications.push(`Strong academic merit: Your CGPA is ${studentCgpa.toFixed(1)} / 10 (Cut-off is ${minCgpa.toFixed(1)}).`);
    checks.push({
      criterion: 'Academic Merit (CGPA / %)',
      studentValue: `${studentCgpa.toFixed(1)} CGPA`,
      requiredValue: `Min ${minCgpa.toFixed(1)} CGPA / ${(minCgpa * 10).toFixed(0)}%`,
      passed: true,
      isMandatory: true,
      reason: `Your academic score (${studentCgpa.toFixed(1)}) comfortably satisfies or exceeds the minimum threshold.`
    });
  } else {
    const margin = minCgpa - studentCgpa;
    if (margin <= 0.5) {
      earnedScore += 12; // partial credit if close
      missingRequirements.push(`CGPA is ${studentCgpa.toFixed(1)}, slightly below the cut-off of ${minCgpa.toFixed(1)} (Margin of ${(margin * 10).toFixed(0)}%).`);
    } else {
      missingRequirements.push(`Requires minimum CGPA of ${minCgpa.toFixed(1)} (or ${(minCgpa * 10).toFixed(0)}%). Your current CGPA is ${studentCgpa.toFixed(1)}.`);
    }
    checks.push({
      criterion: 'Academic Merit (CGPA / %)',
      studentValue: `${studentCgpa.toFixed(1)} CGPA`,
      requiredValue: `Min ${minCgpa.toFixed(1)} CGPA`,
      passed: false,
      isMandatory: true,
      reason: `Current academic record falls short of the minimum threshold by ${margin.toFixed(2)} grade points.`
    });
  }

  // 3. Family Income Ceiling Check (Weight: 25)
  totalWeight += 25;
  const maxIncome = rules.maxFamilyIncome ?? Infinity;
  const incomePassed = profile.annualFamilyIncome <= maxIncome;
  if (incomePassed) {
    earnedScore += 25;
    const formattedMax = maxIncome === Infinity ? 'No Upper Limit' : `₹${(maxIncome / 100000).toFixed(1)} LPA`;
    qualifications.push(`Meets income criteria: Family income ₹${(profile.annualFamilyIncome / 100000).toFixed(2)} LPA (Ceiling: ${formattedMax}).`);
    checks.push({
      criterion: 'Annual Family Income',
      studentValue: `₹${(profile.annualFamilyIncome / 100000).toFixed(2)} LPA`,
      requiredValue: maxIncome === Infinity ? 'No Limit' : `≤ ₹${(maxIncome / 100000).toFixed(1)} LPA`,
      passed: true,
      isMandatory: true,
      reason: `Your reported income is within the economic assistance ceiling.`
    });
  } else {
    hasHardFailure = true;
    missingRequirements.push(`Family annual income (₹${(profile.annualFamilyIncome / 100000).toFixed(2)} LPA) exceeds the ceiling of ₹${(maxIncome / 100000).toFixed(1)} LPA.`);
    checks.push({
      criterion: 'Annual Family Income',
      studentValue: `₹${(profile.annualFamilyIncome / 100000).toFixed(2)} LPA`,
      requiredValue: `≤ ₹${(maxIncome / 100000).toFixed(1)} LPA`,
      passed: false,
      isMandatory: true,
      reason: `Family annual income exceeds the maximum permitted limit for this need-based grant.`
    });
  }

  // 4. Demographic & Special Eligibility (Gender, Category, Domicile, Branch, Year) (Weight: 25)
  totalWeight += 25;
  let demoPassedCount = 0;
  let demoTotalCriteria = 0;

  // Gender check
  if (rules.genderPreference && rules.genderPreference !== 'All') {
    demoTotalCriteria++;
    if (rules.genderPreference === 'Female Only') {
      if (profile.gender === 'Female') {
        demoPassedCount++;
        qualifications.push('Eligible for exclusive female scholarship quota.');
      } else {
        hasHardFailure = true;
        missingRequirements.push('This grant is exclusively open to female candidates.');
      }
    }
  }

  // Category check
  if (rules.allowedCategories && rules.allowedCategories.length > 0) {
    demoTotalCriteria++;
    if (rules.allowedCategories.includes(profile.category) || rules.allowedCategories.includes('General')) {
      demoPassedCount++;
      qualifications.push(`Category ${profile.category} is accepted under eligible quotas.`);
    } else {
      missingRequirements.push(`Designated exclusively for ${rules.allowedCategories.join(', ')} categories. You selected ${profile.category}.`);
    }
  }

  // Branch check
  if (rules.eligibleBranches && rules.eligibleBranches.length > 0 && !rules.eligibleBranches.includes('All')) {
    demoTotalCriteria++;
    const branchMatch = rules.eligibleBranches.some(b => 
      profile.branch.toLowerCase().includes(b.toLowerCase()) || 
      b.toLowerCase().includes(profile.branch.toLowerCase())
    );
    if (branchMatch) {
      demoPassedCount++;
      qualifications.push(`Academic branch (${profile.branch}) is an approved domain.`);
    } else {
      missingRequirements.push(`Limited to specialized courses: ${rules.eligibleBranches.join(', ')}.`);
    }
  }

  // Course Year check
  if (rules.courseYear && rules.courseYear.length > 0) {
    demoTotalCriteria++;
    if (rules.courseYear.includes(profile.academicYear)) {
      demoPassedCount++;
    } else {
      missingRequirements.push(`Open to Year ${rules.courseYear.join(' & ')} students only (You are in Year ${profile.academicYear}).`);
    }
  }

  // State Domicile check
  if (rules.stateDomicile && !rules.stateDomicile.includes('All India')) {
    demoTotalCriteria++;
    if (rules.stateDomicile.includes(profile.stateDomicile)) {
      demoPassedCount++;
      qualifications.push(`State domicile requirement satisfied (${profile.stateDomicile}).`);
    } else {
      missingRequirements.push(`Restricted to permanent residents of ${rules.stateDomicile.join(', ')}.`);
    }
  }

  if (demoTotalCriteria === 0) {
    earnedScore += 25;
    checks.push({
      criterion: 'Demographics & Course Restrictions',
      studentValue: 'Open Criteria',
      requiredValue: 'All Demographics & Streams Eligible',
      passed: true,
      isMandatory: false,
      reason: 'No restrictive quotas or stream constraints apply to this scheme.'
    });
  } else {
    const demoFraction = demoPassedCount / demoTotalCriteria;
    earnedScore += Math.round(25 * demoFraction);
    checks.push({
      criterion: 'Specific Quotas & Course Criteria',
      studentValue: `${profile.gender}, ${profile.category}, Year ${profile.academicYear}`,
      requiredValue: 'Meets targeted program specifications',
      passed: demoFraction >= 0.75,
      isMandatory: true,
      reason: demoFraction >= 0.75 
        ? `Satisfies ${demoPassedCount} of ${demoTotalCriteria} specialized program criteria.`
        : `Only satisfies ${demoPassedCount} of ${demoTotalCriteria} required demographic and course conditions.`
    });
  }

  // Calculate Match Score
  const matchScore = Math.min(100, Math.max(0, Math.round((earnedScore / totalWeight) * 100)));

  // Status classification
  let status: EligibilityEvaluation['status'];
  if (hasHardFailure || matchScore < 55) {
    status = 'Not Eligible';
  } else if (matchScore >= 80 && missingRequirements.length === 0) {
    status = 'Eligible';
  } else {
    status = 'Potentially Eligible';
  }

  // Calculate Opportunity Score (Compatibility 50%, Value 30%, Urgency 20%)
  const compatibilityComponent = matchScore * 0.50;

  // Value Score (0 to 100)
  let valueScore = 60;
  if (scholarship.amount >= 1000000) valueScore = 100;
  else if (scholarship.amount >= 200000) valueScore = 90;
  else if (scholarship.amount >= 80000) valueScore = 80;
  else if (scholarship.amount >= 45000) valueScore = 70;
  const valueComponent = valueScore * 0.30;

  // Deadline Urgency & Feasibility (0 to 100)
  const today = new Date('2026-11-07');
  const deadlineDate = new Date(scholarship.deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let urgencyScore = 70;
  if (diffDays < 0) urgencyScore = 10;
  else if (diffDays <= 7) urgencyScore = 80; // High urgency
  else if (diffDays <= 21) urgencyScore = 95; // Golden window
  else if (diffDays <= 45) urgencyScore = 88;
  else urgencyScore = 75; // Far out

  const urgencyComponent = urgencyScore * 0.20;

  const opportunityScore = Math.round(compatibilityComponent + valueComponent + urgencyComponent);

  // Recommendation Note
  let recommendationNote = '';
  if (status === 'Eligible') {
    recommendationNote = `High match (${matchScore}%)! Your academic record and socioeconomic background align closely with the criteria of ${scholarship.organization}. We strongly recommend adding this to your tracker and applying before ${scholarship.deadline}.`;
  } else if (status === 'Potentially Eligible') {
    recommendationNote = `Moderate match (${matchScore}%). You fulfill key prerequisites, though review: ${missingRequirements[0] || 'minor requirements'}. You may still qualify with proper institutional endorsement.`;
  } else {
    recommendationNote = `Low match (${matchScore}%). You do not meet primary prerequisites: ${missingRequirements.slice(0, 2).join('; ')}. Focus your energy on other recommended opportunities.`;
  }

  return {
    scholarshipId: scholarship.id,
    matchScore,
    status,
    opportunityScore,
    checks,
    missingRequirements,
    qualifications,
    recommendationNote
  };
}

export function detectMissingDocuments(
  scholarship: Scholarship,
  vaultDocs: VaultDocument[]
): {
  requiredCount: number;
  readyCount: number;
  missingDocs: Scholarship['requiredDocuments'];
  readyDocs: Scholarship['requiredDocuments'];
  isComplete: boolean;
  completionPercentage: number;
} {
  const normalizedVaultTypes = vaultDocs.map(d => d.docType.toLowerCase().trim());
  const normalizedFileNames = vaultDocs.map(d => d.fileName.toLowerCase());

  const readyDocs: Scholarship['requiredDocuments'] = [];
  const missingDocs: Scholarship['requiredDocuments'] = [];

  scholarship.requiredDocuments.forEach(req => {
    const reqName = req.name.toLowerCase();
    const isPresent = normalizedVaultTypes.some(vt => 
      vt.includes(reqName) || 
      reqName.includes(vt) ||
      (reqName.includes('aadhaar') && vt.includes('aadhaar')) ||
      (reqName.includes('income') && vt.includes('income')) ||
      (reqName.includes('marksheet') && (vt.includes('marksheet') || vt.includes('transcript'))) ||
      (reqName.includes('bonafide') && vt.includes('bonafide')) ||
      (reqName.includes('caste') && vt.includes('caste')) ||
      (reqName.includes('passbook') && (vt.includes('passbook') || vt.includes('bank'))) ||
      (reqName.includes('passport') && vt.includes('passport'))
    ) || normalizedFileNames.some(fn => 
      (reqName.includes('aadhaar') && fn.includes('aadhaar')) ||
      (reqName.includes('income') && fn.includes('income')) ||
      (reqName.includes('transcript') && fn.includes('transcript')) ||
      (reqName.includes('marksheet') && fn.includes('marksheet'))
    );

    if (isPresent) {
      readyDocs.push(req);
    } else {
      missingDocs.push(req);
    }
  });

  const requiredCount = scholarship.requiredDocuments.length;
  const readyCount = readyDocs.length;
  const completionPercentage = requiredCount > 0 ? Math.round((readyCount / requiredCount) * 100) : 100;

  return {
    requiredCount,
    readyCount,
    missingDocs,
    readyDocs,
    isComplete: missingDocs.length === 0,
    completionPercentage
  };
}
