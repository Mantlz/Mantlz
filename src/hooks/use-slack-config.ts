import { useState, useEffect } from 'react';
import { client } from '@/lib/client';

interface SlackConfig {
  enabled: boolean;
  webhookUrl: string;
  defaultChannel?: string;
}

interface SlackConfigResponse {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
  webhookUrl: string;
  channel: string | null;
}

interface SlackWebhookResponse {
  success: boolean;
}

export function useSlackConfig() {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<SlackConfig | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const response = await client.slack.getConfig.$get();
      const data = (response as unknown as { json: SlackConfigResponse }).json;
      if (data) {
        setConfig({
          enabled: data.enabled ?? false,
          webhookUrl: data.webhookUrl ?? '',
          defaultChannel: data.channel ?? undefined,
        });
      }
    } catch (error) {
      console.error('Error loading Slack config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: SlackConfig) => {
    try {
      await client.slack.updateConfig.$post({
        enabled: newConfig.enabled,
        webhookUrl: newConfig.webhookUrl,
        channel: newConfig.defaultChannel,
      });
      setConfig(newConfig);
      return true;
    } catch (error) {
      console.error('Error saving Slack config:', error);
      throw error;
    }
  };

  const testWebhook = async (webhookUrl: string, channel?: string) => {
    try {
      const response = await client.slack.testWebhook.$post({
        webhookUrl,
        channel,
      });
      return (response as unknown as { json: SlackWebhookResponse }).json.success;
    } catch (error) {
      console.error('Error testing webhook:', error);
      throw error;
    }
  };

  return {
    config,
    isLoading,
    saveConfig,
    testWebhook,
    refresh: loadConfig,
  };
} 