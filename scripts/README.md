# Mantle Scripts

Utility scripts for managing the Mantle application.

## Delete User Script

The `delete-user.ts` script allows you to completely remove a user and all their associated data from the database.

### ⚠️ WARNING

**This script permanently deletes all user data and cannot be undone!**

The script will delete:
- User account
- All forms created by the user
- All submissions to their forms
- All campaigns and email data
- All payment and subscription data
- All API keys
- All integrations (Slack, Discord, Stripe)
- All quota and usage data
- All DNS records
- All notification logs

### Prerequisites

1. Make sure you have the correct database connection string in your `.env` file
2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

### Usage

#### From the project root (recommended)
```bash
npx tsx scripts/delete-user.ts <userId>
```

#### Alternative method using Node.js directly
```bash
node -r tsx/cjs scripts/delete-user.ts <userId>
```

### Example

```bash
# Delete user with ID cmdxr4a7t0009o7l42j1nfm0c
npx tsx scripts/delete-user.ts cmdxr4a7t0009o7l42j1nfm0c
```

### What the script does

1. **Verification**: Checks if the user exists and displays their basic info
2. **Transaction**: Uses a database transaction to ensure all deletions succeed or fail together
3. **Cascading Deletion**: Deletes data in the correct order to respect foreign key constraints:
   - First: Dependent records (sent emails, campaign recipients, etc.)
   - Then: Main records (forms, campaigns, submissions, etc.)
   - Finally: User account and direct relationships
4. **Logging**: Provides detailed console output showing progress

### Safety Features

- Uses database transactions for atomicity
- Verifies user exists before attempting deletion
- Provides detailed logging of each step
- Handles errors gracefully

### Troubleshooting

If the script fails:
1. Check your database connection
2. Ensure you have the correct user ID
3. Verify the user exists in the database
4. Check the console output for specific error messages

### Development

To modify or extend the script:
1. The script uses Prisma Client for database operations
2. All deletions are wrapped in a transaction
3. The deletion order is important due to foreign key constraints
4. Add new model deletions in the appropriate order based on dependencies