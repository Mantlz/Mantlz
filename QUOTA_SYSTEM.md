# Quota System Documentation

## Overview

This document explains how the quota system works in Mantlz, including when quotas reset and the new end-of-month warning system.

## Quota Reset Schedule

### When Quotas Reset
- **Reset Date**: First day of each month at 00:00 UTC
- **Reset Frequency**: Monthly
- **Calculation**: Uses `addMonths(startOfMonth(new Date()), 1)` in the usage router

### What Gets Reset
- ✅ **Submission Count**: Resets to 0
- ❌ **Form Count**: Carries over from previous month
- ❌ **Campaign Count**: Carries over from previous month
- ❌ **Email Metrics**: Reset to 0 (emailsSent, emailsOpened, emailsClicked)

### What Doesn't Get Reset
- Actual form data and submissions remain in the database
- User's plan and settings
- Form configurations and settings

## Quota Plans

### FREE Plan
- Max Forms: 1
- Max Submissions/Month: 200
- Campaigns: Disabled

### STANDARD Plan
- Max Forms: 5
- Max Submissions/Month: 5,000
- Campaigns: 3/month, 500 recipients each

### PRO Plan
- Max Forms: 10
- Max Submissions/Month: 10,000
- Campaigns: 10/month, 10,000 recipients each

## End-of-Month Warning System

### Purpose
Notify users 3 days before their quota resets to:
- Export any important submission data
- Review current month's analytics
- Consider upgrading if needed

### Implementation

#### Email Template
- **File**: `src/emails/quota-warning-email.tsx`
- **Features**:
  - Shows current usage statistics
  - Displays remaining quota
  - Provides action recommendations
  - Links to dashboard

#### Cron Job
- **File**: `src/app/api/cron/quota-warnings/route.ts`
- **Schedule**: Daily at 9:00 AM UTC (`0 9 * * *`)
- **Logic**: Only sends emails when exactly 3 days before month end
- **Filtering**: Only sends to users with >10% quota usage

#### Configuration
- **File**: `vercel.json`
- **Cron Entry**: Added quota-warnings endpoint
- **Security**: Uses CRON_SECRET for authentication

### Email Sending Criteria

#### Who Receives Warnings
- Users with submissions in the current month
- Users who have used >10% of their monthly quota
- All plan types (FREE, STANDARD, PRO)

#### Who Doesn't Receive Warnings
- Users with no submissions this month
- Users with <10% quota usage (to avoid spam)
- Users without valid email addresses

### Email Content

#### Subject Line
```
⚠️ Your monthly quota resets in 3 days - Export your data now!
```

#### Key Information
- Current usage statistics
- Days until reset
- Usage percentage
- Remaining submissions
- Action recommendations

## Technical Implementation

### Database Schema
The quota system uses the `quota` table with:
- `userId`: Foreign key to user
- `year`: Current year
- `month`: Current month (1-12)
- `submissionCount`: Current month's submissions
- `formCount`: Carried over from previous month
- `campaignCount`: Carried over from previous month
- Email metrics (sent, opened, clicked)

### Key Services

#### QuotaService
- `getCurrentQuota()`: Gets or creates current month's quota
- `canSubmitForm()`: Checks submission limits
- `canCreateForm()`: Checks form creation limits
- `updateQuota()`: Updates quota metrics
- `simulateEndOfMonth()`: Testing utility

#### Usage Router
- Provides quota information to frontend
- Calculates reset dates
- Returns usage statistics

### Cron Jobs

#### Existing
- **Scheduled Campaigns**: `0 * * * *` (hourly)
  - Processes scheduled email campaigns

#### New
- **Quota Warnings**: `0 9 * * *` (daily at 9 AM UTC)
  - Sends end-of-month warnings

## Environment Variables

### Required
- `CRON_SECRET`: Authentication for cron endpoints
- `NEXT_PUBLIC_APP_DOMAIN`: Domain for email sending
- `NEXT_PUBLIC_APP_URL`: Base URL for dashboard links