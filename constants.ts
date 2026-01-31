
import { IssueCategory } from './types';

export const STATES = [
  "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Uttar Pradesh", "Delhi"
];

export const DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ["Amaravati", "Visakhapatnam", "Vijayawada", "Guntur", "Kurnool"],
  "Karnataka": ["Bangalore Urban", "Mysore", "Hubli", "Mangalore"],
  "Maharashtra": ["Mumbai City", "Pune", "Nagpur", "Nashik"]
};

export const CONSTITUENCIES: Record<string, string[]> = {
  "Amaravati": ["Tulluru", "Mangalagiri", "Tadikonda"],
  "Bangalore Urban": ["Hebbal", "BTM Layout", "Jayanagar", "Majestic"],
  "Mumbai City": ["Colaba", "Dharavi", "Sion"]
};

export const VILLAGES: Record<string, string[]> = {
  "Tulluru": ["Village A", "Village B", "Ward 12"],
  "Hebbal": ["Kodigehalli", "RT Nagar", "Ganganagar"],
  "Colaba": ["Navy Nagar", "Backbay", "Sasoon Dock"]
};

export const CATEGORIES: IssueCategory[] = [
  'Roads', 'Water', 'Electricity', 'Waste', 'Healthcare', 'Education', 'Other'
];

export const INITIAL_ISSUES = [
  {
    id: "1",
    title: "Major Potholes on Main Street",
    description: "The road connecting the market to the station is severely damaged. Multiple bike accidents reported.",
    category: "Roads",
    priority: "High",
    status: "In Progress",
    location: { state: "Andhra Pradesh", district: "Amaravati", constituency: "Tulluru", village: "Village A" },
    authorId: "user_1",
    authorName: "John Doe",
    reactions: 45,
    comments: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAnonymous: false
  },
  {
    id: "2",
    title: "Water Supply Interruption",
    description: "No water supply for the past 48 hours in Ward 5. Local tank is empty.",
    category: "Water",
    priority: "Emergency",
    status: "Pending",
    location: { state: "Andhra Pradesh", district: "Amaravati", constituency: "Tulluru", village: "Village B" },
    authorId: "user_2",
    authorName: "Priya S.",
    reactions: 128,
    comments: 34,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    isAnonymous: false
  }
];
