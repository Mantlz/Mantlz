import { HTTPException } from "hono/http-exception";

// Types and interfaces
export type FormFieldValue = string | number | boolean | null | undefined;

export interface SlackWebhookConfig {
  webhookUrl: string;
  channel?: string;
  username?: string;
  icon_emoji?: string;
}

export interface SlackNotificationOptions {
  formId: string;
  formName: string;
  submissionId: string;
  submissionData: Record<string, FormFieldValue>;
  timestamp: Date;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface SlackMessageBlock {
  type: 'section' | 'divider' | 'context';
  text?: {
    type: 'mrkdwn' | 'plain_text';
    text: string;
  };
  fields?: Array<{
    type: 'mrkdwn' | 'plain_text';
    text: string;
  }>;
}

export class SlackService {
  private static instance: SlackService;
  private constructor() {}

  public static getInstance(): SlackService {
    if (!SlackService.instance) {
      SlackService.instance = new SlackService();
    }
    return SlackService.instance;
  }

  /**
   * Send a notification to Slack
   */
  public async sendNotification(
    config: SlackWebhookConfig,
    options: SlackNotificationOptions
  ): Promise<void> {
    try {
      const blocks = this.buildNotificationBlocks(options);
      await this.sendToWebhook(config, blocks);
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      throw new HTTPException(500, { message: 'Failed to send Slack notification' });
    }
  }

  /**
   * Test a Slack webhook configuration
   */
  public async testWebhook(config: SlackWebhookConfig): Promise<boolean> {
    try {
      const testBlocks: SlackMessageBlock[] = [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '✅ Your Slack integration is working correctly!'
        }
      }];

      await this.sendToWebhook(config, testBlocks);
      return true;
    } catch (error) {
      console.error('Error testing Slack webhook:', error);
      return false;
    }
  }

  /**
   * Build notification blocks for Slack message
   */
  private buildNotificationBlocks(options: SlackNotificationOptions): SlackMessageBlock[] {
    const { formName, submissionData, timestamp, metadata } = options;
    const blocks: SlackMessageBlock[] = [];

    // Header
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `📝 *New Form Submission*\n*Form:* ${formName}\n*Submitted:* ${timestamp.toLocaleString()}`
      }
    });

    // Divider
    blocks.push({ type: 'divider' });

    // Submission Data
    const fields = Object.entries(submissionData)
      .map(([key, value]) => ({
        type: 'mrkdwn' as const,
        text: `*${key}:* ${value}`
      }));

    // Split fields into chunks of 10 (Slack limit)
    for (let i = 0; i < fields.length; i += 10) {
      blocks.push({
        type: 'section',
        fields: fields.slice(i, i + 10)
      });
    }

    // Metadata (if provided)
    if (metadata) {
      blocks.push({ type: 'divider' });
      blocks.push({
        type: 'context',
        text: {
          type: 'mrkdwn',
          text: `*Metadata:*${metadata.userAgent ? `\nUser Agent: ${metadata.userAgent}` : ''}${metadata.ipAddress ? `\nIP: ${metadata.ipAddress}` : ''}`
        }
      });
    }

    return blocks;
  }

  /**
   * Send message to Slack webhook
   */
  private async sendToWebhook(
    config: SlackWebhookConfig,
    blocks: SlackMessageBlock[]
  ): Promise<void> {
    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: "Test message", // Fallback text
          blocks,
          ...(config.channel ? { channel: config.channel } : {}),
          ...(config.username ? { username: config.username } : {}),
          ...(config.icon_emoji ? { icon_emoji: config.icon_emoji } : {})
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Slack webhook error details:', {
          status: response.status,
          statusText: response.statusText,
          error
        });
        throw new Error(`Slack webhook error: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error('Slack webhook network error:', error);
      throw error;
    }
  }
} 