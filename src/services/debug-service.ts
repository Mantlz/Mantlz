export type LogLevel = 'basic' | 'detailed' | 'verbose';

export interface DebugConfig {
  enabled: boolean;
  webhookUrl: string | null;
  logLevel: LogLevel;
  includeMetadata: boolean;
  endpoint?: string;
  apiKey?: string;
  testData?: {
    formId: string;
    data: Record<string, unknown>;
  };
}

interface DebugLog {
  timestamp: string;
  level: LogLevel;
  event: string;
  data: Record<string, unknown>;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
  };
  response?: {
    status: number;
    headers: Record<string, string>;
    body: Record<string, unknown>;
  };
  error?: {
    message: string;
    stack?: string;
  };
}

class DebugService {
  private static instance: DebugService;
  private config: DebugConfig = {
    enabled: false,
    webhookUrl: null,
    logLevel: 'basic',
    includeMetadata: false,
    testData: {
      formId: '',
      data: {}
    }
  };

  private constructor() {}

  static getInstance(): DebugService {
    if (!DebugService.instance) {
      DebugService.instance = new DebugService();
    }
    return DebugService.instance;
  }

  setConfig(config: DebugConfig) {
    this.config = config;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    const levels: Record<LogLevel, number> = {
      basic: 1,
      detailed: 2,
      verbose: 3,
    };
    return levels[level] <= levels[this.config.logLevel];
  }

  private logToConsole(log: DebugLog) {
    const logLevel = this.config.logLevel;
    const logData = logLevel === 'basic' 
      ? { event: log.event, timestamp: log.timestamp }
      : logLevel === 'detailed'
      ? { event: log.event, timestamp: log.timestamp, data: log.data }
      : log;

    console.log(`[Debug] ${log.event}:`, logData);
  }

  async testEndpoint() {
    try {
      const response = await fetch(this.config.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(this.config.testData)
      });

      const data = await response.json();

      return {
        status: response.status,
        statusText: response.statusText,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  // Convenience methods for testing different scenarios
  async testInvalidApiKey() {
    if (!this.config.testData) return;
    const originalApiKey = this.config.apiKey;
    this.config.apiKey = 'invalid_key';
    await this.testEndpoint();
    this.config.apiKey = originalApiKey;
  }

  async testInvalidFormId() {
    if (!this.config.testData) return;
    const originalFormId = this.config.testData.formId;
    this.config.testData = { ...this.config.testData, formId: 'invalid_form_id' };
    await this.testEndpoint();
    this.config.testData = { ...this.config.testData, formId: originalFormId };
  }

  async testInvalidData() {
    if (!this.config.testData) return;
    const originalData = this.config.testData.data;
    this.config.testData = { ...this.config.testData, data: { invalid: 'data' } };
    await this.testEndpoint();
    this.config.testData = { ...this.config.testData, data: originalData };
  }

  async log(event: string, data: Record<string, unknown>) {
    if (!this.shouldLog('basic')) return;
    
    const log: DebugLog = {
      timestamp: new Date().toISOString(),
      level: this.config.logLevel,
      event,
      data,
      request: {
        url: '',
        method: '',
        headers: {},
        body: {}
      }
    };

    this.logToConsole(log);
  }

  async logFormSubmission(formId: string, submissionId: string, data: Record<string, unknown>) {
    await this.log('form_submission', { formId, submissionId, data });
  }

  async logEmailSent(formId: string, submissionId: string, data: Record<string, unknown>) {
    await this.log('email_sent', { formId, submissionId, data });
  }

  async logEmailError(formId: string, submissionId: string, error: Error) {
    await this.log('email_error', { formId, submissionId, error: error.message });
  }
}

export const debugService = DebugService.getInstance(); 