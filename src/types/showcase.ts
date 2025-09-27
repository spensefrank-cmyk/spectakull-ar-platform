export interface ShowcaseProject {
  id: string;
  projectId: string;
  projectName: string;
  description: string;
  creatorName: string;
  creatorEmail: string;
  thumbnailUrl: string;
  qrCodeUrl: string;
  showcaseEnabled: boolean;
  approvedByAdmin: boolean;
  submittedAt: number;
  approvedAt?: number;
  tags: string[];
  category: 'business' | 'education' | 'entertainment' | 'art' | 'marketing' | 'other';
  engagementStats: {
    views: number;
    scans: number;
    shares: number;
  };
  socialPlatforms: {
    twitter: boolean;
    linkedin: boolean;
    instagram: boolean;
    facebook: boolean;
  };
}
