export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface User {
  id: string;
  email: string;
  role: 'donor' | 'hospital' | 'admin';
  name: string;
  profileId?: string;
}

export interface DonationRecord {
  id: string;
  hospitalName: string;
  patientType: string;
  donatedAt: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  location: string;
  distanceKm: number;
  matchScore: number;
  totalDonations: number;
  responseRate: number;
  lastDonationDate: string;
  availability: 'available' | 'pending' | 'unavailable';
  aiRecommendation: string;
  donationHistory: DonationRecord[];
  phone?: string;
  nextEligibleDate?: string;
  livesImpacted?: number;
}

export interface BloodRequest {
  id: string;
  hospitalName: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'active' | 'pending' | 'completed';
  matchesFound: number;
  contacted: number;
  confirmed: number;
  createdAt: string;
  deadline: string;
  patientCondition: string;
  location: string;
  doctorName: string;
  completedAt?: string;
  completedBy?: string;
}

export interface NearbyRequest {
  id: string;
  bloodType: BloodType;
  hospitalName: string;
  distanceKm: number;
  urgency: 'high' | 'medium' | 'low';
  matchScore: number;
}

export interface DashboardStats {
  totalDonors: number;
  activeRequests: number;
  successfulMatches: number;
  systemAccuracy: number;
  accuracyChange: number;
  donorsChange: number;
  donationTrends: { month: string; donations: number; matches: number }[];
  bloodTypeDistribution: Record<BloodType, number>;
  recentActivity: { type: string; description: string; detail: string; timeAgo: string }[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastUpdated: string;
  status: string;
}
