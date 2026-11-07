import { evaluateEligibility, detectMissingDocuments } from '../src/utils/eligibilityEngine.ts';
import { SAMPLE_SCHOLARSHIPS } from '../src/data/sampleScholarships.ts';
import { DEMO_PROFILES, INITIAL_VAULT_DOCUMENTS } from '../src/data/demoProfiles.ts';

console.log('🧪 Starting GRANTLY Rule Engine & Data Verification Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// Test 1: Priya Sharma (Female, B.Tech CSE, 8.8 CGPA, 3.2L income) matches Adobe Research WIT
const priya = DEMO_PROFILES[0];
const adobeSch = SAMPLE_SCHOLARSHIPS.find(s => s.id === 'sch-adobe-research-07')!;
const priyaAdobeEval = evaluateEligibility(adobeSch, priya);

assert(
  priyaAdobeEval.status === 'Eligible' || priyaAdobeEval.status === 'Potentially Eligible',
  'Priya qualifies for Adobe WIT (Female, CSE, CGPA 8.8 >= 8.0)'
);
assert(
  priyaAdobeEval.matchScore >= 80,
  `Priya match score is high (${priyaAdobeEval.matchScore}% >= 80%)`
);
assert(
  priyaAdobeEval.opportunityScore > 70,
  `Opportunity score is high (${priyaAdobeEval.opportunityScore} > 70)`
);

// Test 2: Rahul Verma (Male) against female-only AICTE Pragati
const rahul = DEMO_PROFILES[1];
const pragatiSch = SAMPLE_SCHOLARSHIPS.find(s => s.id === 'sch-aicte-pragati-02')!;
const rahulPragatiEval = evaluateEligibility(pragatiSch, rahul);

assert(
  rahulPragatiEval.status === 'Not Eligible',
  'Male student fails female-only AICTE Pragati scholarship rule'
);
assert(
  rahulPragatiEval.missingRequirements.some(r => r.toLowerCase().includes('female')),
  'Missing requirements clearly explains female-only quota restriction'
);

// Test 3: Income ceiling test: ONGC Foundation requires income < 2.0 LPA
const ongcSch = SAMPLE_SCHOLARSHIPS.find(s => s.id === 'sch-ongc-merit-10')!;
const priyaOngcEval = evaluateEligibility(ongcSch, priya); // Priya is 3.2 LPA
assert(
  priyaOngcEval.checks.find(c => c.criterion.includes('Income'))?.passed === false,
  'Student with 3.2 LPA income fails ONGC 2.0 LPA ceiling check'
);

const rahulOngcEval = evaluateEligibility(ongcSch, rahul); // Rahul is 1.8 LPA, SC
assert(
  rahulOngcEval.checks.find(c => c.criterion.includes('Income'))?.passed === true,
  'Student with 1.8 LPA income passes ONGC 2.0 LPA ceiling check'
);

// Test 4: Missing Document Detector
const pragatiMissingDocs = detectMissingDocuments(pragatiSch, INITIAL_VAULT_DOCUMENTS);
assert(
  pragatiMissingDocs.readyCount > 0,
  `Detects ready documents in vault (${pragatiMissingDocs.readyCount} ready)`
);
assert(
  pragatiMissingDocs.missingDocs.some(d => d.name.toLowerCase().includes('bonafide') || d.name.toLowerCase().includes('admission')),
  'Accurately flags missing College Bonafide or Admission Letter'
);

// Test 5: Opportunity Score components
assert(
  priyaAdobeEval.opportunityScore >= 0 && priyaAdobeEval.opportunityScore <= 100,
  'Opportunity score is normalized within 0 to 100 range'
);

console.log(`\n🎉 Test Suite Completed: ${passedTests}/${totalTests} tests passed successfully!`);
