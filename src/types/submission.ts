// Defines the structure for notification log entries
export interface NotificationLog {
  id: string; // Or number, depending on your data model
  type: string; // e.g., 'SUBMISSION_CONFIRMATION', 'DEVELOPER_NOTIFICATION'
  status: 'SENT' | 'FAILED' | 'SKIPPED' | 'PENDING';
  createdAt: string; // Or Date
  error?: string | null;
  // Add any other relevant fields from your notification logs
}

// Defines a minimal structure for a Submission, focusing on fields used in utils
// You might want to extend this or import a more complete type if available elsewhere
export interface Submission {
  id: string; // Or number
  email?: string | null;
  createdAt: string; // Or Date
  notificationLogs?: NotificationLog[];
  // Include other fields used by potential future utils (e.g., data, analytics)
  data?: Record<string, any> & { 
    _meta?: {
      browser?: string;
      country?: string;
      // other meta fields
    }
  };
  analytics?: {
    browser?: string;
    location?: string;
    // other analytics fields
  };
  formName?: string;
  status?: string; // If you have a general submission status
} 