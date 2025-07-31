// This file acts as a simple in-memory database for demonstration purposes.
// In a real-world application, you would use a persistent data store like Redis, Firestore, or a SQL database.

type ExecutionStatus = "processing" | "completed" | "failed";

interface GeneratedPost {
  postContent: string;
  imageUrl: string;
}

interface ExecutionRecord {
  status: ExecutionStatus;
  data?: GeneratedPost | null;
  error?: string;
}

export const executions = new Map<string, ExecutionRecord>();
