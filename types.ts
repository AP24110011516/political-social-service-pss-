
export type UserType = 'citizen' | 'panchayat' | 'representative';

export interface LocationData {
  state: string;
  district: string;
  constituency: string;
  village: string;
}

export interface User {
  id: string;
  aadhaarNumber: string;
  mobileNumber: string;
  isVerified: boolean;
  location: LocationData;
  userType: UserType;
  name: string;
}

export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Emergency';
export type IssueCategory = 'Roads' | 'Water' | 'Electricity' | 'Waste' | 'Healthcare' | 'Education' | 'Other';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: IssueStatus;
  location: LocationData;
  authorId: string;
  authorName: string;
  reactions: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
}

export interface Representative {
  id: string;
  name: string;
  position: string;
  constituency: string;
  photo: string;
  performanceMetrics: {
    issuesResolved: number;
    averageResponseTime: number; // in days
    pendingIssues: number;
    satisfactionRate: number; // 0-100
  };
}
