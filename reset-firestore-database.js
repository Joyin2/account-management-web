#!/usr/bin/env node
/**
 * FIRESTORE DATABASE RESET SCRIPT
 * 
 * This script safely deletes all existing collections in Firestore and recreates them as empty collections.
 * It includes multiple safety measures, confirmation prompts, and comprehensive audit logging.
 * 
 * DANGER: This operation is IRREVERSIBLE. All data will be permanently deleted.
 * 
 * Usage: node reset-firestore-database.js
 * 
 * Requirements:
 * - Firebase Admin SDK service account key
 * - Proper Firebase project permissions
 * - Node.js environment
 */

const admin = require('firebase-admin');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  PROJECT_ID: 'accountmanagement-42375',
  BACKUP_DIR: './firestore-backup',
  LOG_FILE: './database-reset-log.txt',
  SERVICE_ACCOUNT_PATH: './serviceAccountKey.json', // You need to download this from Firebase Console
  COLLECTIONS: {
    // Top-level collections
    topLevel: [
      'transactions',
      'users', 
      'organizations',
      'systemConfig',
      'businessTypes',
      'inventory',
      'test'
    ],
    // Sub-collections (will be handled automatically when parent is deleted)
    subCollections: {
      'users': ['inventory', 'stockMovements'],
      'organizations': [
        'accounting/buy',
        'accounting/sell', 
        'accounting/expenditure',
        'accounting/capital',
        'accounting/bank',
        'accounting/loan',
        'inventory'
      ]
    }
  }
};

// Logging utility
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.startTime = new Date();
    this.log('='.repeat(80));
    this.log('FIRESTORE DATABASE RESET OPERATION STARTED');
    this.log('='.repeat(80));
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    console.log(logEntry);
    
    // Append to log file
    try {
      fs.appendFileSync(this.logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  error(message, error = null) {
    this.log(message, 'ERROR');
    if (error) {
      this.log(`Error details: ${error.message}`, 'ERROR');
      this.log(`Stack trace: ${error.stack}`, 'ERROR');
    }
  }

  warn(message) {
    this.log(message, 'WARN');
  }

  success(message) {
    this.log(message, 'SUCCESS');
  }

  finalize() {
    const duration = (new Date() - this.startTime) / 1000;
    this.log('='.repeat(80));
    this.log(`OPERATION COMPLETED IN ${duration} SECONDS`);
    this.log('='.repeat(80));
  }
}

// Initialize logger
const logger = new Logger(CONFIG.LOG_FILE);

// Readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to ask user questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Initialize Firebase Admin SDK
function initializeFirebase() {
  try {
    logger.log('Initializing Firebase Admin SDK...');
    
    // Check if service account key exists
    if (!fs.existsSync(CONFIG.SERVICE_ACCOUNT_PATH)) {
      throw new Error(`Service account key not found at ${CONFIG.SERVICE_ACCOUNT_PATH}`);
    }

    const serviceAccount = require(CONFIG.SERVICE_ACCOUNT_PATH);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: CONFIG.PROJECT_ID
    });

    logger.success('Firebase Admin SDK initialized successfully');
    return admin.firestore();
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK', error);
    throw error;
  }
}

// Create backup directory
function createBackupDirectory() {
  try {
    if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
      fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
      logger.log(`Created backup directory: ${CONFIG.BACKUP_DIR}`);
    }
  } catch (error) {
    logger.error('Failed to create backup directory', error);
    throw error;
  }
}

// List all collections and document counts
async function analyzeDatabase(db) {
  try {
    logger.log('Analyzing current database structure...');
    const analysis = {
      collections: {},
      totalDocuments: 0,
      totalCollections: 0
    };

    for (const collectionName of CONFIG.COLLECTIONS.topLevel) {
      try {
        const collectionRef = db.collection(collectionName);
        const snapshot = await collectionRef.get();
        const docCount = snapshot.size;
        
        analysis.collections[collectionName] = {
          documentCount: docCount,
          exists: docCount > 0
        };
        
        analysis.totalDocuments += docCount;
        if (docCount > 0) analysis.totalCollections++;
        
        logger.log(`Collection '${collectionName}': ${docCount} documents`);
      } catch (error) {
        logger.warn(`Could not analyze collection '${collectionName}': ${error.message}`);
        analysis.collections[collectionName] = {
          documentCount: 0,
          exists: false,
          error: error.message
        };
      }
    }

    logger.log(`Total collections with data: ${analysis.totalCollections}`);
    logger.log(`Total documents across all collections: ${analysis.totalDocuments}`);
    
    return analysis;
  } catch (error) {
    logger.error('Failed to analyze database', error);
    throw error;
  }
}

// Export collection data for backup
async function exportCollectionData(db, collectionName) {
  try {
    logger.log(`Exporting data from collection '${collectionName}'...`);
    
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    
    if (snapshot.empty) {
      logger.log(`Collection '${collectionName}' is empty, skipping export`);
      return;
    }

    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        data: doc.data()
      });
    });

    const backupFile = path.join(CONFIG.BACKUP_DIR, `${collectionName}-backup.json`);
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    
    logger.success(`Exported ${data.length} documents from '${collectionName}' to ${backupFile}`);
  } catch (error) {
    logger.error(`Failed to export collection '${collectionName}'`, error);
    throw error;
  }
}

// Delete all documents in a collection
async function deleteCollection(db, collectionName) {
  try {
    logger.log(`Deleting all documents in collection '${collectionName}'...`);
    
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    
    if (snapshot.empty) {
      logger.log(`Collection '${collectionName}' is already empty`);
      return 0;
    }

    const batch = db.batch();
    let deleteCount = 0;
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      deleteCount++;
    });

    await batch.commit();
    logger.success(`Deleted ${deleteCount} documents from collection '${collectionName}'`);
    
    return deleteCount;
  } catch (error) {
    logger.error(`Failed to delete collection '${collectionName}'`, error);
    throw error;
  }
}

// Create empty collection with a placeholder document (then delete it)
async function createEmptyCollection(db, collectionName) {
  try {
    logger.log(`Creating empty collection '${collectionName}'...`);
    
    // Firestore automatically creates collections when you add documents
    // We'll add a placeholder document and then delete it
    const collectionRef = db.collection(collectionName);
    const placeholderDoc = await collectionRef.add({
      _placeholder: true,
      _createdAt: admin.firestore.FieldValue.serverTimestamp(),
      _note: 'This is a placeholder document to create the collection structure'
    });
    
    // Delete the placeholder document
    await placeholderDoc.delete();
    
    logger.success(`Created empty collection '${collectionName}'`);
  } catch (error) {
    logger.error(`Failed to create empty collection '${collectionName}'`, error);
    throw error;
  }
}

// Main safety confirmation flow
async function confirmOperation(analysis) {
  logger.warn('⚠️  DANGER: This operation will PERMANENTLY DELETE all data in your Firestore database!');
  logger.warn('⚠️  This action is IRREVERSIBLE!');
  logger.log('');
  logger.log('Database Analysis:');
  logger.log(`- Total collections with data: ${analysis.totalCollections}`);
  logger.log(`- Total documents to be deleted: ${analysis.totalDocuments}`);
  logger.log('');
  
  // First confirmation
  const confirm1 = await askQuestion('Do you want to proceed with this DANGEROUS operation? Type "yes" to continue: ');
  if (confirm1 !== 'yes') {
    logger.log('Operation cancelled by user');
    return false;
  }

  // Second confirmation with project ID
  const confirm2 = await askQuestion(`Please type the project ID "${CONFIG.PROJECT_ID}" to confirm: `);
  if (confirm2 !== CONFIG.PROJECT_ID) {
    logger.log('Project ID confirmation failed. Operation cancelled.');
    return false;
  }

  // Third confirmation with current timestamp
  const timestamp = Math.floor(Date.now() / 1000);
  const confirm3 = await askQuestion(`Final confirmation. Type "${timestamp}" to proceed: `);
  if (confirm3 !== timestamp.toString()) {
    logger.log('Timestamp confirmation failed. Operation cancelled.');
    return false;
  }

  logger.success('All confirmations passed. Proceeding with database reset...');
  return true;
}

// Main execution function
async function main() {
  let db;
  
  try {
    // Initialize Firebase
    db = initializeFirebase();
    
    // Create backup directory
    createBackupDirectory();
    
    // Analyze current database
    const analysis = await analyzeDatabase(db);
    
    // Safety confirmations
    const confirmed = await confirmOperation(analysis);
    if (!confirmed) {
      logger.log('Operation aborted by user');
      process.exit(0);
    }

    // Ask about backup
    const shouldBackup = await askQuestion('Do you want to create a backup before deletion? (recommended) [y/N]: ');
    
    if (shouldBackup === 'y' || shouldBackup === 'yes') {
      logger.log('Creating backup of existing data...');
      
      for (const collectionName of CONFIG.COLLECTIONS.topLevel) {
        if (analysis.collections[collectionName]?.exists) {
          await exportCollectionData(db, collectionName);
        }
      }
      
      logger.success('Backup completed');
    } else {
      logger.warn('Proceeding without backup as requested');
    }

    // Delete all collections
    logger.log('Starting deletion process...');
    let totalDeleted = 0;
    
    for (const collectionName of CONFIG.COLLECTIONS.topLevel) {
      const deletedCount = await deleteCollection(db, collectionName);
      totalDeleted += deletedCount;
    }
    
    logger.success(`Deleted ${totalDeleted} total documents`);

    // Recreate empty collections
    logger.log('Recreating empty collections...');
    
    for (const collectionName of CONFIG.COLLECTIONS.topLevel) {
      await createEmptyCollection(db, collectionName);
    }
    
    logger.success('All collections recreated as empty');
    
    // Final verification
    logger.log('Verifying database reset...');
    const finalAnalysis = await analyzeDatabase(db);
    
    if (finalAnalysis.totalDocuments === 0) {
      logger.success('✅ Database reset completed successfully!');
      logger.success('✅ All collections are now empty');
      logger.log('');
      logger.log('Next steps:');
      logger.log('1. Your application can now create new data');
      logger.log('2. Check the backup files if you need to restore any data');
      logger.log('3. Review the log file for complete operation details');
    } else {
      logger.error(`❌ Database reset may not be complete. ${finalAnalysis.totalDocuments} documents still exist`);
    }

  } catch (error) {
    logger.error('Database reset operation failed', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (rl) {
      rl.close();
    }
    
    logger.finalize();
    
    // Close Firebase connection
    if (db) {
      try {
        await admin.app().delete();
      } catch (error) {
        logger.error('Failed to close Firebase connection', error);
      }
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  logger.warn('Operation interrupted by user (Ctrl+C)');
  rl.close();
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.warn('Operation terminated');
  rl.close();
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { main, CONFIG, Logger };