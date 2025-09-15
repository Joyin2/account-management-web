# Firebase Service Account Setup Guide

## Quick Setup Instructions

The database reset script requires a Firebase Admin SDK service account key. Follow these steps:

### Step 1: Download Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `accountmanagement-42375`
3. Click the **gear icon** (Project Settings)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Rename it to `serviceAccountKey.json`
8. Place it in the project root directory

### Step 2: Verify File Location

Ensure the file is located at:
```
c:\joyin projects\accountManagement\website\next-gen-accounts\serviceAccountKey.json
```

### Step 3: Run the Reset Script

```bash
npm run reset-database
```

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `serviceAccountKey.json` to version control
- The file is already added to `.gitignore`
- Delete the file after use if desired

## Alternative: Use Existing Firebase Config

If you prefer not to download a service account key, I can modify the script to use your existing Firebase client configuration with elevated permissions.

---

**Next Steps**: After downloading the service account key, run `npm run reset-database` again.