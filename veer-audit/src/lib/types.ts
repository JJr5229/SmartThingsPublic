// Shared types for the audit tool.

export type CategoryKey = 'performance' | 'seo' | 'security';

export interface CheckResult {
  id: string;
  label: string;
  passed: boolean;
  // Human-readable detail shown on the scorecard and used to brief the proposal.
  detail: string;
  // Relative weight of this check within its category.
  weight: number;
}

export interface CategoryScore {
  key: CategoryKey;
  label: string;
  score: number; // 0–100
  checks: CheckResult[];
}

export interface AuditResult {
  url: string;
  normalizedUrl: string;
  fetchedAt: string; // ISO timestamp
  overallScore: number; // 0–100, weighted across categories
  categories: CategoryScore[];
  // The lowest-scoring categories, used to target the proposal.
  weakestCategories: CategoryKey[];
  error?: string;
}

export interface Lead {
  id: string;
  email: string;
  url: string;
  createdAt: string;
  overallScore: number;
  categoryScores: Record<CategoryKey, number>;
}
