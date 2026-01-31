
import axios, { AxiosError } from 'axios';
import { User, Issue } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Reasonable timeout
});

// Resilient fallback data for when the backend is unreachable
const MOCK_DB = {
  user: {
    id: "1",
    name: "Ramesh Kumar",
    aadhaarNumber: "123456789012",
    mobileNumber: "+91 9876543210",
    isVerified: true,
    userType: 'citizen' as const,
    location: {
      state: "Andhra Pradesh",
      district: "Amaravati",
      constituency: "Tulluru",
      village: "Village A"
    }
  },
  issues: [] as Issue[]
};

/**
 * Utility to handle API calls with a local fallback.
 * This ensures the frontend stays functional even if the Express server isn't running.
 */
async function withFallback<T>(apiCall: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    const axiosError = error as AxiosError;
    // If it's a network error (server down) or timeout, use fallback
    if (!axiosError.response || axiosError.code === 'ECONNABORTED') {
      console.warn(`Backend unreachable at ${API_BASE_URL}. Using local simulation.`, axiosError.message);
      return new Promise((resolve) => setTimeout(() => resolve(fallbackData), 500));
    }
    throw error;
  }
}

export const api = {
  auth: {
    login: async (aadhaar: string) => {
      return withFallback(
        async () => {
          const { data } = await client.post<User>('/auth/login', { aadhaar });
          return data;
        },
        { ...MOCK_DB.user, aadhaarNumber: aadhaar }
      );
    },
  },
  issues: {
    getAll: async () => {
      return withFallback(
        async () => {
          const { data } = await client.get<Issue[]>('/issues');
          return data;
        },
        MOCK_DB.issues
      );
    },
    create: async (issueData: Partial<Issue>) => {
      try {
        const { data } = await client.post<Issue>('/issues', issueData);
        return data;
      } catch (error) {
        // Simple mock creation if server is down
        const newIssue = {
          id: Math.random().toString(36).substr(2, 9),
          ...issueData,
          reactions: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'Pending',
        } as Issue;
        MOCK_DB.issues.unshift(newIssue);
        return newIssue;
      }
    },
    upvote: async (id: string) => {
      try {
        const { data } = await client.patch<Issue>(`/issues/${id}/vote`);
        return data;
      } catch (error) {
        const issue = MOCK_DB.issues.find(i => i.id === id);
        if (issue) issue.reactions += 1;
        return issue!;
      }
    },
  },
  analytics: {
    getTrends: async () => {
      return withFallback(
        async () => {
          const { data } = await client.get<{ insights: string }>('/analytics/trends');
          return data;
        },
        { insights: "Currently running in Local Simulation Mode. Connect to a live SQL backend for deep AI infrastructure analysis." }
      );
    },
  },
};
