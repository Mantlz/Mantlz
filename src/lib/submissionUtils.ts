import { type Submission, type NotificationLog } from '@/types/submission';

// Define a minimal interface for the logs if the main Submission type is too complex or not easily available
// interface NotificationLog {
//   type: string;
//   status: 'SENT' | 'FAILED' | 'SKIPPED' | 'PENDING';
// }

// interface MinimalSubmission {
//   notificationLogs?: NotificationLog[];
// }

/**
 * Determines the status of the user confirmation email based on notification logs.
 * @param notificationLogs - The array of notification logs for the submission.
 * @returns An object containing the status type, color class, and display text.
 */
export function getUserEmailStatus(notificationLogs?: Submission['notificationLogs']) {
  // Default status if no logs or email capability assumed
  const defaultStatus = {
    type: 'PENDING',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    text: 'Pending'
  };

  if (!notificationLogs || notificationLogs.length === 0) {
    return defaultStatus;
  }

  // Check for sent email confirmation
  if (notificationLogs.some((log: NotificationLog) =>
    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SENT'
  )) {
    return {
      type: 'SENT',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      text: 'Sent'
    };
  }
  
  // Check for failed email
  if (notificationLogs.some((log: NotificationLog) =>
    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'FAILED'
  )) {
    return {
      type: 'FAILED',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      text: 'Failed'
    };
  }
  
  // Check for skipped email
  if (notificationLogs.some((log: NotificationLog) =>
    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SKIPPED'
  )) {
    return {
      type: 'SKIPPED',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      text: 'Skipped'
    };
  }
  
  // Default to pending if specific statuses aren't found
  return defaultStatus;
}

// You could potentially add getDeveloperEmailStatus here too if needed 