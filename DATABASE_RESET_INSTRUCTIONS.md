# Firestore Database Reset Instructions

⚠️ **CRITICAL WARNING: This operation will PERMANENTLY DELETE all data in your Firestore database!**

This document provides step-by-step instructions for safely resetting your Firestore database using the provided reset script.

## Prerequisites

### 1. Firebase Admin SDK Service Account Key

You need to download a service account key from the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `accountmanagement-42375`
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file and save it as `serviceAccountKey.json` in the project root
6. **NEVER commit this file to version control!**

### 2. Install Dependencies

```bash
npm install firebase-admin
```

### 3. Verify Project Configuration

Ensure the script is configured for the correct Firebase project:
- Project ID: `accountmanagement-42375`
- Service account key path: `./serviceAccountKey.json`

## Database Collections

The script will reset the following collections:

### Top-Level Collections:
- `transactions` - All transaction records
- `users` - User profiles and authentication data
- `organizations` - Organization data with sub-collections
- `systemConfig` - System configuration settings
- `businessTypes` - Business type definitions
- `inventory` - Top-level inventory for reports
- `test` - Test data collection

### Sub-Collections (automatically handled):
- `users/{userId}/inventory` - User-specific inventory
- `users/{userId}/inventory/{itemId}/stockMovements` - Stock movement logs
- `organizations/{orgId}/accounting/buy` - Purchase transactions
- `organizations/{orgId}/accounting/sell` - Sales transactions
- `organizations/{orgId}/accounting/expenditure` - Expense records
- `organizations/{orgId}/accounting/capital` - Capital transactions
- `organizations/{orgId}/accounting/bank` - Bank transactions
- `organizations/{orgId}/accounting/loan` - Loan records
- `organizations/{orgId}/inventory` - Organization inventory

## Safety Features

The reset script includes multiple safety measures:

### 1. Multiple Confirmation Prompts
- Initial "yes" confirmation
- Project ID verification
- Timestamp-based final confirmation

### 2. Database Analysis
- Pre-operation analysis of all collections
- Document count reporting
- Collection existence verification

### 3. Backup Options
- Optional data export before deletion
- JSON backup files stored in `./firestore-backup/`
- Individual collection backup files

### 4. Comprehensive Logging
- Detailed operation log in `./database-reset-log.txt`
- Timestamped entries for audit trail
- Error tracking and stack traces

### 5. Error Handling
- Graceful error recovery
- Operation rollback on critical failures
- Safe process termination

## Usage Instructions

### Step 1: Preparation

```bash
# Ensure you're in the project directory
cd /path/to/next-gen-accounts

# Install dependencies if not already installed
npm install

# Verify service account key exists
ls -la serviceAccountKey.json
```

### Step 2: Run the Reset Script

```bash
# Using npm script (recommended)
npm run reset-database

# Or directly with node
node reset-firestore-database.js
```

### Step 3: Follow Interactive Prompts

1. **Database Analysis**: Review the current database state
2. **First Confirmation**: Type "yes" to proceed
3. **Project ID Confirmation**: Type the exact project ID
4. **Timestamp Confirmation**: Type the provided timestamp
5. **Backup Option**: Choose whether to create backups (recommended)
6. **Execution**: The script will delete and recreate collections
7. **Verification**: Final database state verification

## Example Session

```
================================================================================
FIRESTORE DATABASE RESET OPERATION STARTED
================================================================================
[2024-01-15T10:30:00.000Z] [INFO] Initializing Firebase Admin SDK...
[2024-01-15T10:30:01.000Z] [SUCCESS] Firebase Admin SDK initialized successfully
[2024-01-15T10:30:01.000Z] [INFO] Analyzing current database structure...
[2024-01-15T10:30:02.000Z] [INFO] Collection 'transactions': 150 documents
[2024-01-15T10:30:02.000Z] [INFO] Collection 'users': 25 documents
[2024-01-15T10:30:02.000Z] [INFO] Collection 'organizations': 10 documents
[2024-01-15T10:30:02.000Z] [INFO] Total collections with data: 3
[2024-01-15T10:30:02.000Z] [INFO] Total documents across all collections: 185

⚠️  DANGER: This operation will PERMANENTLY DELETE all data in your Firestore database!
⚠️  This action is IRREVERSIBLE!

Database Analysis:
- Total collections with data: 3
- Total documents to be deleted: 185

Do you want to proceed with this DANGEROUS operation? Type "yes" to continue: yes
Please type the project ID "accountmanagement-42375" to confirm: accountmanagement-42375
Final confirmation. Type "1705316402" to proceed: 1705316402

[2024-01-15T10:30:15.000Z] [SUCCESS] All confirmations passed. Proceeding with database reset...
Do you want to create a backup before deletion? (recommended) [y/N]: y

[2024-01-15T10:30:20.000Z] [INFO] Creating backup of existing data...
[2024-01-15T10:30:25.000Z] [SUCCESS] Exported 150 documents from 'transactions' to ./firestore-backup/transactions-backup.json
[2024-01-15T10:30:30.000Z] [SUCCESS] Backup completed

[2024-01-15T10:30:30.000Z] [INFO] Starting deletion process...
[2024-01-15T10:30:35.000Z] [SUCCESS] Deleted 150 documents from collection 'transactions'
[2024-01-15T10:30:40.000Z] [SUCCESS] Deleted 185 total documents

[2024-01-15T10:30:40.000Z] [INFO] Recreating empty collections...
[2024-01-15T10:30:45.000Z] [SUCCESS] All collections recreated as empty

[2024-01-15T10:30:45.000Z] [SUCCESS] ✅ Database reset completed successfully!
[2024-01-15T10:30:45.000Z] [SUCCESS] ✅ All collections are now empty

Next steps:
1. Your application can now create new data
2. Check the backup files if you need to restore any data
3. Review the log file for complete operation details

================================================================================
OPERATION COMPLETED IN 45 SECONDS
================================================================================
```

## Post-Reset Actions

### 1. Verify Application Functionality
- Test user registration and login
- Verify transaction creation
- Check inventory management
- Test all major features

### 2. Review Generated Files
- **Log file**: `./database-reset-log.txt` - Complete operation audit trail
- **Backup files**: `./firestore-backup/*.json` - Data backups (if created)

### 3. Security Cleanup
```bash
# Remove service account key after use (optional but recommended)
rm serviceAccountKey.json

# Add to .gitignore if not already present
echo "serviceAccountKey.json" >> .gitignore
echo "firestore-backup/" >> .gitignore
echo "database-reset-log.txt" >> .gitignore
```

## Troubleshooting

### Common Issues

#### 1. Service Account Key Not Found
```
Error: Service account key not found at ./serviceAccountKey.json
```
**Solution**: Download the service account key from Firebase Console

#### 2. Permission Denied
```
Error: Permission denied. Insufficient permissions.
```
**Solution**: Ensure the service account has Firestore Admin permissions

#### 3. Project ID Mismatch
```
Error: Project ID confirmation failed
```
**Solution**: Verify you're using the correct project ID: `accountmanagement-42375`

#### 4. Network/Connection Issues
```
Error: Failed to connect to Firestore
```
**Solution**: Check internet connection and Firebase project status

### Recovery Options

#### 1. Restore from Backup
If you created backups, you can restore data by:
1. Reviewing backup files in `./firestore-backup/`
2. Using Firebase Admin SDK to re-import data
3. Creating a custom restore script

#### 2. Partial Recovery
If the operation failed partway through:
1. Check the log file for the exact failure point
2. Manually verify database state
3. Re-run the script if needed

## Security Considerations

### 1. Service Account Key Security
- **Never commit** `serviceAccountKey.json` to version control
- Store securely and delete after use
- Rotate keys regularly in production

### 2. Access Control
- Only run this script in development/staging environments
- Require multiple approvals for production resets
- Maintain audit logs of all database operations

### 3. Backup Strategy
- Always create backups before destructive operations
- Test backup restoration procedures
- Store backups in secure, separate locations

## Production Considerations

⚠️ **WARNING: This script is designed for development and testing environments.**

For production use:
1. Implement additional approval workflows
2. Add database migration capabilities
3. Integrate with CI/CD pipelines
4. Add automated backup verification
5. Implement gradual rollout strategies

## Support

If you encounter issues:
1. Check the generated log file for detailed error information
2. Verify all prerequisites are met
3. Review the troubleshooting section
4. Contact the development team with log files and error details

---

**Remember: This operation is irreversible. Always ensure you have proper backups and authorization before proceeding.**