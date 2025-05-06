import { processScheduledCampaigns } from "./scheduledCampaigns";

/**
 * Simple scheduler for running jobs at regular intervals
 */
export class Scheduler {
  private scheduledCampaignsInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

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
    
    // Schedule the campaign job to run every minute
    this.scheduledCampaignsInterval = setInterval(async () => {
      try {
        await processScheduledCampaigns();
      } catch (error) {
        console.error("Error running scheduled campaigns job:", error);
      }
    }, 60 * 1000); // Check every minute
    
    // Run immediately on startup
    processScheduledCampaigns().catch(error => {
      console.error("Error running initial scheduled campaigns job:", error);
    });

    console.log("Scheduler started");
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