import { HTTPException } from "hono/http-exception";
import { FormFieldValue } from "@/types/form";

export interface DiscordWebhookConfig {
  webhookUrl: string;
  channel?: string;
  username?: string;
  avatar_url?: string;
}

export interface DiscordNotificationOptions {
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

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp?: string;
}

export class DiscordService {
  private static instance: DiscordService;
  private constructor() {}

  public static getInstance(): DiscordService {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService();
    }
    return DiscordService.instance;
  }

  /**
   * Send a notification to Discord
   */
  public async sendNotification(
    config: DiscordWebhookConfig,
    options: DiscordNotificationOptions
  ): Promise<void> {
    try {
      const embeds = this.buildNotificationEmbeds(options);
      await this.sendToWebhook(config, embeds);
    } catch (error) {
      console.error('Error sending Discord notification:', error);
      throw new HTTPException(500, { message: 'Failed to send Discord notification' });
    }
  }

  /**
   * Test a Discord webhook configuration
   */
  public async testWebhook(config: DiscordWebhookConfig): Promise<boolean> {
    try {
      const testEmbed: DiscordEmbed = {
        title: 'Test Notification',
        description: '✅ Your Discord integration is working correctly!',
        color: 0x00ff00,
        timestamp: new Date().toISOString()
      };

      await this.sendToWebhook(config, [testEmbed]);
      return true;
    } catch (error) {
      console.error('Error testing Discord webhook:', error);
      return false;
    }
  }

  /**
   * Build notification embeds for Discord message
   */
  private buildNotificationEmbeds(options: DiscordNotificationOptions): DiscordEmbed[] {
    const { formName, submissionData, timestamp, metadata } = options;
    const embeds: DiscordEmbed[] = [];

    // Main embed with form info
    const mainEmbed: DiscordEmbed = {
      title: '📝 New Form Submission',
      description: `**Form:** ${formName}\n**Submitted:** ${timestamp.toLocaleString()}`,
      color: 0x00ff00,
      timestamp: timestamp.toISOString(),
      fields: []
    };

    // Add submission data as fields
    Object.entries(submissionData).forEach(([key, value]) => {
      mainEmbed.fields?.push({
        name: key,
        value: String(value),
        inline: true
      });
    });

    embeds.push(mainEmbed);

    // Add metadata in separate embed if provided
    if (metadata && (metadata.userAgent || metadata.ipAddress)) {
      const metadataEmbed: DiscordEmbed = {
        title: 'Submission Metadata',
        color: 0x808080,
        fields: []
      };

      if (metadata.userAgent) {
        metadataEmbed.fields?.push({
          name: 'User Agent',
          value: metadata.userAgent,
          inline: false
        });
      }

      if (metadata.ipAddress) {
        metadataEmbed.fields?.push({
          name: 'IP Address',
          value: metadata.ipAddress,
          inline: true
        });
      }

      embeds.push(metadataEmbed);
    }

    return embeds;
  }

  /**
   * Send message to Discord webhook
   */
  private async sendToWebhook(
    config: DiscordWebhookConfig,
    embeds: DiscordEmbed[]
  ): Promise<void> {
    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: null,
          embeds,
          ...(config.channel ? { channel: config.channel } : {}),
          ...(config.username ? { username: config.username } : {}),
          ...(config.avatar_url ? { avatar_url: config.avatar_url } : {})
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Discord webhook error details:', {
          status: response.status,
          statusText: response.statusText,
          error
        });
        throw new Error(`Discord webhook error: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error('Discord webhook network error:', error);
      throw error;
    }
  }
} 