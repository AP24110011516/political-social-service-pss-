
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

// Fix: Initializing app without explicit Application type often resolves overload mismatch issues
const app = express();
const PORT = 5000;

// Fix: Standard middleware usage with 'as any' casting to resolve PathParams overload mismatch in TypeScript
app.use(cors() as any);
app.use(express.json() as any);

// Initialize Gemini with the provided API Key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mock Database State
let mockIssues = [
  {
    id: "1",
    title: "Major Potholes on Main Street",
    description: "The road connecting the market to the station is severely damaged. Multiple bike accidents reported.",
    category: "Roads",
    priority: "High",
    status: "In Progress" as const,
    location: { state: "Andhra Pradesh", district: "Amaravati", constituency: "Tulluru", village: "Village A" },
    authorId: "1",
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
    status: "Pending" as const,
    location: { state: "Andhra Pradesh", district: "Amaravati", constituency: "Tulluru", village: "Village B" },
    authorId: "2",
    authorName: "Priya S.",
    reactions: 128,
    comments: 34,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    isAnonymous: false
  }
];

// --- AUTH ROUTES ---
// Fix: Removing explicit types for req and res allows Express to use contextual typing, 
// ensuring properties like .body and .json are correctly recognized.
app.post('/api/auth/login', (req, res) => {
  const { aadhaar } = req.body;
  
  // Return a full user object matching the 'User' interface in types.ts
  res.json({
    id: "1",
    name: "Ramesh Kumar",
    aadhaarNumber: aadhaar || "123456789012",
    mobileNumber: "+91 9876543210",
    isVerified: true,
    userType: 'citizen',
    location: {
      state: "Andhra Pradesh",
      district: "Amaravati",
      constituency: "Tulluru",
      village: "Village A"
    }
  });
});

// --- ISSUE ROUTES ---
app.get('/api/issues', (req, res) => {
  res.json(mockIssues);
});

app.post('/api/issues', (req, res) => {
  const issueData = req.body;
  const newIssue = {
    id: Math.random().toString(36).substr(2, 9),
    ...issueData,
    reactions: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Pending' as const
  };
  mockIssues.unshift(newIssue);
  res.status(201).json(newIssue);
});

app.patch('/api/issues/:id/vote', (req, res) => {
  const { id } = req.params;
  const issue = mockIssues.find(i => i.id === id);
  if (issue) {
    issue.reactions += 1;
    res.json(issue);
  } else {
    res.status(404).json({ error: 'Issue not found' });
  }
});

// --- ANALYTICS ROUTES (Gemini) ---
app.get('/api/analytics/trends', async (req, res) => {
  const issueSummary = mockIssues.map(i => `${i.category}: ${i.title}`).join("\n");
  
  try {
    // Strategic analysis for government officials using Gemini 3 Pro
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze these civic issues and provide a brief (100 words) strategic summary for government officials: \n\n${issueSummary}`,
    });
    // Access response.text property directly as per latest Gemini SDK guidelines
    res.json({ insights: response.text || "No insights available." });
  } catch (error) {
    console.error("Gemini Analytics Error:", error);
    res.status(500).json({ insights: "AI Analysis currently unavailable." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
