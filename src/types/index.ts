export type HazardSeverity = 'high' | 'medium' | 'low';

export type HazardCategory =
  | 'Electrical Safety'
  | 'Fire Safety'
  | 'Accessibility'
  | 'General Environment';

export interface HazardLocation {
  x: number; // Percentage 0-100 from left
  y: number; // Percentage 0-100 from top
  width: number; // Percentage 0-100 width
  height: number; // Percentage 0-100 height
}

export interface Hazard {
  id: string;
  title: string;
  category: HazardCategory | string;
  severity: HazardSeverity;
  confidence: number; // 0.0 - 1.0
  description: string;
  whyItMatters: string;
  recommendation: string;
  location: HazardLocation;
  fixed?: boolean;
  fixedAt?: string;
}

export interface SafetyCategories {
  electrical: number;
  fire: number;
  accessibility: number;
  environment: number;
}

export interface ScanResult {
  id: string;
  title?: string;
  roomName: string;
  createdAt: string;
  imageUrl: string;
  overallScore: number;
  summary: string;
  categories: SafetyCategories;
  hazards: Hazard[];
  isDemo?: boolean;
  notes?: string;
}

export type AppRoute =
  | '/'
  | '/scan'
  | '/analysis'
  | '/results'
  | `/hazard/${string}`
  | '/history'
  | '/compare'
  | '/dashboard';
