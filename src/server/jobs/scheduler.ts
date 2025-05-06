import { processScheduledCampaigns } from "./scheduledCampaigns";

/**
 * Simple scheduler for running jobs at regular intervals
 */
export class Scheduler {
  private scheduledCampaignsInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private connectionErrorCount = 0;
  private readonly MAX_CONNECTION_ERRORS = 5;
  private readonly INITIAL_RETRY_DELAY = 60 * 1000; // 1 minute

  /**
   * Start the scheduler and all scheduled jobs
   */
  start() {
    if (this.isRunning) {
      console.log("Scheduler is already running");
      return;
    }

    console.log("Starting scheduler...");
    this.isRunning = true;
    this.connectionErrorCount = 0;
    
    // Schedule the campaign job to run every minute
    this.scheduledCampaignsInterval = setInterval(async () => {
      try {
        await this.runCampaignJob();
      } catch (error) {
        console.error("Error running scheduled campaigns job:", error);
      }
    }, 60 * 1000); // Check every minute
    
    // Run immediately on startup with a delay to ensure database connection is ready
    setTimeout(() => {
      this.runCampaignJob().catch(error => {
        console.error("Error running initial scheduled campaigns job:", error);
      });
    }, 15 * 1000); // 15 second delay on startup

    console.log("Scheduler started");
  }

  /**
   * Run the campaign job with retry logic for database connection issues
   */
  private async runCampaignJob() {
    try {
      await processScheduledCampaigns();
      // Reset error count on successful run
      if (this.connectionErrorCount > 0) {
        console.log("Database connection restored after previous errors");
        this.connectionErrorCount = 0;
      }
    } catch (error) {
      // Check if it's a database connection error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("Can't reach database server") || 
        errorMessage.includes("PrismaClientInitializationError") ||
        errorMessage.includes("connection")
      ) {
        this.connectionErrorCount++;
        console.error(`Database connection error (${this.connectionErrorCount}/${this.MAX_CONNECTION_ERRORS}):`, errorMessage);
        
        // If we've had too many consecutive connection errors, increase the interval
        if (this.connectionErrorCount >= this.MAX_CONNECTION_ERRORS) {
          console.log("Too many consecutive database connection errors. Adjusting scheduler interval...");
          this.adjustSchedulerInterval();
        }
      } else {
        // For other types of errors, just log them without affecting the connection error count
        console.error("Error in scheduled campaign job (non-connection error):", errorMessage);
      }
    }
  }

  /**
   * Adjust the scheduler interval when persistent connection issues occur
   */
  private adjustSchedulerInterval() {
    // Clear the current interval
    if (this.scheduledCampaignsInterval) {
      clearInterval(this.scheduledCampaignsInterval);
    }
    
    // Calculate a longer interval based on how many times we've adjusted
    const newInterval = Math.min(
      this.INITIAL_RETRY_DELAY * Math.pow(2, Math.floor(this.connectionErrorCount / this.MAX_CONNECTION_ERRORS) - 1),
      30 * 60 * 1000 // Cap at 30 minutes max
    );
    
    console.log(`Adjusting scheduler interval to ${newInterval/1000} seconds due to persistent connection issues`);
    
    // Set new interval
    this.scheduledCampaignsInterval = setInterval(async () => {
      try {
        await this.runCampaignJob();
      } catch (error) {
        console.error("Error running scheduled campaigns job with adjusted interval:", error);
      }
    }, newInterval);
  }

  /**
   * Stop the scheduler and all scheduled jobs
   */
  stop() {
    if (!this.isRunning) {
      console.log("Scheduler is not running");
      return;
    }

    console.log("Stopping scheduler...");
    
    if (this.scheduledCampaignsInterval) {
      clearInterval(this.scheduledCampaignsInterval);
      this.scheduledCampaignsInterval = null;
    }
    
    this.isRunning = false;
    console.log("Scheduler stopped");
  }
}

// Create a singleton instance
export const scheduler = new Scheduler(); 