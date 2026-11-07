import { Scholarship, TrackedApplication, EligibilityEvaluation } from '../types/scholarship';

export interface FinancialImpactMetrics {
  potentialFunding: number;
  appliedFunding: number;
  awardedFunding: number;
  eligibleCount: number;
  potentialCount: number;
  totalCatalogCount: number;
}

export class AnalyticsService {
  /**
   * Calculates comprehensive financial impact metrics
   */
  public static calculateFinancialImpact(
    evaluations: { scholarship: Scholarship; eval: EligibilityEvaluation }[],
    tracked: TrackedApplication[]
  ): FinancialImpactMetrics {
    const eligibleCount = evaluations.filter(e => e.eval.status === 'Eligible').length;
    const potentialCount = evaluations.filter(e => e.eval.status === 'Potentially Eligible').length;

    // Potential funding: all schemes where student meets minimum criteria
    const potentialFunding = evaluations
      .filter(e => e.eval.status !== 'Not Eligible')
      .reduce((sum, e) => sum + e.scholarship.amount, 0);

    // In-pipeline funding
    const appliedFunding = tracked
      .filter(t => ['Applied', 'Under Review', 'Shortlisted'].includes(t.status))
      .reduce((sum, t) => sum + t.amount, 0);

    // Confirmed awarded funding
    const awardedFunding = tracked
      .filter(t => t.status === 'Approved')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      potentialFunding,
      appliedFunding,
      awardedFunding,
      eligibleCount,
      potentialCount,
      totalCatalogCount: evaluations.length
    };
  }

  /**
   * Generates formatted pipeline data for Recharts visualizations
   */
  public static getPipelineChartData(tracked: TrackedApplication[]) {
    const counts = {
      Interested: tracked.filter(t => t.status === 'Interested').length,
      Preparing: tracked.filter(t => t.status === 'Preparing').length,
      Applied: tracked.filter(t => t.status === 'Applied').length,
      'Under Review': tracked.filter(t => t.status === 'Under Review').length,
      Shortlisted: tracked.filter(t => t.status === 'Shortlisted').length,
      Approved: tracked.filter(t => t.status === 'Approved').length,
    };

    return [
      { name: 'Interested', count: counts.Interested, color: '#94a3b8' },
      { name: 'Preparing', count: counts.Preparing, color: '#38bdf8' },
      { name: 'Applied', count: counts.Applied, color: '#6366f1' },
      { name: 'Under Review', count: counts['Under Review'], color: '#f59e0b' },
      { name: 'Shortlisted', count: counts.Shortlisted, color: '#8b5cf6' },
      { name: 'Approved', count: counts.Approved, color: '#10b981' }
    ];
  }
}
