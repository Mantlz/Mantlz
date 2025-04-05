/**
 * API Test Script for Mantle Form API v1
 * 
 * This script tests the new API endpoints to verify they're working properly and secure.
 * 
 * To run the test:
 * 1. Make sure your environment variables are set up correctly
 * 2. Run this script with `ts-node src/app/api-test.ts` or `npx tsx src/app/api-test.ts`
 */

// Import environment variable handling
import 'dotenv/config';

// Configuration
const API_KEY = process.env.MANTLZ_KEY as string; // Use API key from environment
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/forms` : 'http://localhost:3000/api/v1/forms';
const FORM_ID = process.env.TEST_FORM_ID || 'cm8xm51yo00020j1zkuh8yu8q'; // Optional TEST_FORM_ID from env var

// Check if API key is available
if (!API_KEY) {
  console.error('❌ Error: No API key found in environment variables.');
  console.error('Please make sure MANTLZ_KEY is set in your .env file.');
  process.exit(1);
}

// Types
interface FormResponse {
  id: string;
  name: string;
  description: string;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

interface FormsListResponse {
  forms: FormResponse[];
  nextCursor?: string;
}

interface FormDetailsResponse extends FormResponse {
  emailSettings: {
    enabled: boolean;
    developerNotificationsEnabled: boolean;
  };
}

interface SubmissionResponse {
  id: string;
  createdAt: string;
  data: Record<string, any>;
  email?: string;
}

interface SubmissionsListResponse {
  submissions: SubmissionResponse[];
  nextCursor?: string;
  plan: 'FREE' | 'STANDARD' | 'PRO';
}

interface LogResponse {
  id: string;
  type: string;
  status: string;
  error: string | null;
  createdAt: string;
  submissionId: string;
  submission: {
    id: string;
    email: string | null;
    createdAt: string;
  } | null;
}

interface LogsListResponse {
  logs: LogResponse[];
  nextCursor?: string;
}

interface AnalyticsResponse {
  totalSubmissions: number;
  dailySubmissionRate: number;
  last24HoursSubmissions: number;
  timeSeriesData: Array<{ time: string; submissions: number }>;
  timeRange: 'day' | 'week' | 'month';
  plan: 'STANDARD' | 'PRO';
  weekOverWeekGrowth?: number;
  peakSubmissionHour?: number;
  browserStats?: Record<string, number>;
  locationStats?: Record<string, number>;
}

interface ErrorResponse {
  error: string;
}

async function runTests() {
  console.log('🧪 Starting API Tests...');
  
  // Variable to store the form ID we'll use for tests
  let formId = FORM_ID; // Start with default, but will be overridden if we get forms from the API

  // Test: List Forms
  console.log('\n📋 Testing List Forms Endpoint...');
  try {
    // Simplified URL without apiKey query parameter
    const listUrl = new URL(`${BASE_URL}/list`);
    
    const listResponse = await fetch(listUrl.toString(), {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    const listStatus = listResponse.status;
    const listData = await listResponse.json() as FormsListResponse | ErrorResponse;
    
    console.log(`Status: ${listStatus} ${listResponse.statusText}`);
    if (listStatus === 200) {
      const data = listData as FormsListResponse;
      const forms = data.forms || [];
      console.log(`✅ Success: Retrieved ${forms.length} forms`);
      
      // Get the first form ID for remaining tests
      if (forms.length > 0 && forms[0]) {
        formId = forms[0].id;
        console.log(`\n⚙️ Using form ID: ${formId} for all tests`);
      } else {
        console.log('❌ No forms found to test with');
        return; // Exit if no forms found
      }
    } else {
      console.log(`❌ Error: ${JSON.stringify(listData)}`);
      return; // Exit if list call fails
    }
  } catch (error) {
    console.error('❌ List Forms Test Error:', error);
    return; // Exit if error
  }

  // Test: Get Form Details
  console.log('\n📝 Testing Get Form Details Endpoint...');
  try {
    // URL without query parameters
    const formUrl = new URL(`${BASE_URL}/${formId}`);
    
    const formResponse = await fetch(formUrl.toString(), {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    const formStatus = formResponse.status;
    const formData = await formResponse.json() as FormDetailsResponse | ErrorResponse;
    
    console.log(`Status: ${formStatus} ${formResponse.statusText}`);
    if (formStatus === 200) {
      const formDetails = formData as FormDetailsResponse;
      console.log(`✅ Success: Form "${formDetails.name}" retrieved`);
      console.log(`Form has ${formDetails.submissionCount} submissions`);
    } else {
      console.log(`❌ Error: ${JSON.stringify(formData)}`);
    }
  } catch (error) {
    console.error('❌ Get Form Details Test Error:', error);
  }

  // Test: Get Form Submissions
  console.log('\n📊 Testing Form Submissions Endpoint...');
  try {
    // URL without query parameters
    const submissionsUrl = new URL(`${BASE_URL}/${formId}/submissions`);
    
    const submissionsResponse = await fetch(submissionsUrl.toString(), {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    const submissionsStatus = submissionsResponse.status;
    const submissionsData = await submissionsResponse.json() as SubmissionsListResponse | ErrorResponse;
    
    console.log(`Status: ${submissionsStatus} ${submissionsResponse.statusText}`);
    if (submissionsStatus === 200) {
      const data = submissionsData as SubmissionsListResponse;
      const submissions = data.submissions || [];
      console.log(`✅ Success: Retrieved ${submissions.length} submissions`);
      
      if (submissions.length > 0 && submissions[0]) {
        console.log(`Latest submission: ${new Date(submissions[0].createdAt).toLocaleString()}`);
        
        // Test plan-based data restrictions
        console.log(`User plan: ${data.plan}`);
        if (data.plan === 'FREE') {
          const submissionData = submissions[0].data || {};
          const hasMetaData = '_meta' in submissionData;
          console.log(`Analytics metadata ${hasMetaData ? '❌ present (should be removed)' : '✅ removed'} for FREE plan`);
        }
      } else {
        console.log('No submissions found.');
      }
    } else {
      console.log(`❌ Error: ${JSON.stringify(submissionsData)}`);
    }
  } catch (error) {
    console.error('❌ Form Submissions Test Error:', error);
  }

  // Test: Get Form Logs (PRO-only)
  console.log('\n📃 Testing Form Logs Endpoint (PRO only)...');
  try {
    // URL without query parameters
    const logsUrl = new URL(`${BASE_URL}/${formId}/logs`);
    
    const logsResponse = await fetch(logsUrl.toString(), {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    const logsStatus = logsResponse.status;
    const logsData = await logsResponse.json() as LogsListResponse | ErrorResponse;
    
    console.log(`Status: ${logsStatus} ${logsResponse.statusText}`);
    if (logsStatus === 200) {
      const data = logsData as LogsListResponse;
      const logs = data.logs || [];
      console.log(`✅ Success: Retrieved ${logs.length} notification logs`);
      console.log(`You have PRO access`);
    } else if (logsStatus === 403) {
      console.log(`✅ Expected restriction: ${(logsData as ErrorResponse).error}`);
      console.log(`This is correct behavior for non-PRO plans`);
    } else {
      console.log(`❌ Error: ${JSON.stringify(logsData)}`);
    }
  } catch (error) {
    console.error('❌ Form Logs Test Error:', error);
  }

  // Test: Get Form Analytics (STANDARD/PRO only)
  console.log('\n📈 Testing Form Analytics Endpoint (STANDARD/PRO only)...');
  try {
    // URL without query parameters
    const analyticsUrl = new URL(`${BASE_URL}/${formId}/analytics`);
    
    const analyticsResponse = await fetch(analyticsUrl.toString(), {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    const analyticsStatus = analyticsResponse.status;
    const analyticsData = await analyticsResponse.json() as AnalyticsResponse | ErrorResponse;
    
    console.log(`Status: ${analyticsStatus} ${analyticsResponse.statusText}`);
    if (analyticsStatus === 200) {
      const data = analyticsData as AnalyticsResponse;
      console.log(`✅ Success: Retrieved analytics data`);
      console.log(`Total submissions: ${data.totalSubmissions}`);
      console.log(`Time range: ${data.timeRange} (default)`);
      console.log(`User plan: ${data.plan}`);
      
      // Check for plan-specific analytics
      if (data.plan === 'PRO') {
        const hasBrowserStats = !!data.browserStats;
        const hasLocationStats = !!data.locationStats;
        console.log(`Extended analytics for PRO: ${hasBrowserStats && hasLocationStats ? '✅ present' : '❌ missing'}`);
      } else if (data.plan === 'STANDARD') {
        const hasBasicAnalytics = data.timeSeriesData && data.dailySubmissionRate;
        console.log(`Basic analytics for STANDARD: ${hasBasicAnalytics ? '✅ present' : '❌ missing'}`);
      }
    } else if (analyticsStatus === 403) {
      console.log(`✅ Expected restriction: ${(analyticsData as ErrorResponse).error}`);
      console.log(`This is correct behavior for FREE plan`);
    } else {
      console.log(`❌ Error: ${JSON.stringify(analyticsData)}`);
    }
  } catch (error) {
    console.error('❌ Form Analytics Test Error:', error);
  }

  // Test: Security - Invalid API Key
  console.log('\n🔒 Testing Security - Invalid API Key...');
  try {
    // URL without query parameters
    const invalidKeyUrl = new URL(`${BASE_URL}/list`);
    
    const invalidKeyResponse = await fetch(invalidKeyUrl.toString(), {
      headers: {
        'X-API-Key': 'invalid_key_test'
      }
    });
    const invalidKeyStatus = invalidKeyResponse.status;
    const invalidKeyData = await invalidKeyResponse.json() as ErrorResponse;
    
    console.log(`Status: ${invalidKeyStatus} ${invalidKeyResponse.statusText}`);
    if (invalidKeyStatus === 401) {
      console.log(`✅ Security working: ${invalidKeyData.error}`);
    } else {
      console.log(`❌ Security issue: Expected 401, got ${invalidKeyStatus}`);
      console.log(`Error message: ${JSON.stringify(invalidKeyData)}`);
    }
  } catch (error) {
    console.error('❌ Security Test Error:', error);
  }

  // Test: Rate Limiting (simple test)
  console.log('\n⏱️ Testing Rate Limiting (Simple Test)...');
  try {
    console.log('Making 5 rapid requests to test rate limiting...');
    
    // URL without query parameters
    const rateUrl = new URL(`${BASE_URL}/list`);
    
    const fetchOptions = {
      headers: {
        'X-API-Key': API_KEY
      }
    };
    
    const results = await Promise.all([
      fetch(rateUrl.toString(), fetchOptions),
      fetch(rateUrl.toString(), fetchOptions),
      fetch(rateUrl.toString(), fetchOptions),
      fetch(rateUrl.toString(), fetchOptions),
      fetch(rateUrl.toString(), fetchOptions)
    ]);
    
    const allSuccessful = results.every(r => r.status === 200);
    const anyRateLimited = results.some(r => r.status === 429);
    
    if (allSuccessful) {
      console.log('✅ All requests successful - rate limit not reached');
    } else if (anyRateLimited) {
      console.log('✅ Rate limiting working - some requests were limited');
    } else {
      console.log('⚠️ Unexpected response pattern from rate limiting test');
    }
    
    // Check decreasing remaining count
    const firstRemaining = parseInt(results[0].headers.get('X-RateLimit-Remaining') || '0', 10);
    const lastRemaining = parseInt(results[4].headers.get('X-RateLimit-Remaining') || '0', 10);
    
    if (firstRemaining > lastRemaining) {
      console.log(`✅ Rate limit counter decreasing: ${firstRemaining} → ${lastRemaining}`);
    } else {
      console.log(`⚠️ Rate limit counter not behaving as expected: ${firstRemaining} → ${lastRemaining}`);
    }
  } catch (error) {
    console.error('❌ Rate Limiting Test Error:', error);
  }

  console.log('\n🏁 API Tests Completed!');
}

// Run the tests
runTests().catch(err => {
  console.error('Fatal error running tests:', err);
}); 