/**
 * Firestore Database Reset Script (Client SDK Version)
 * 
 * This script uses the Firebase Client SDK instead of Admin SDK,
 * making it easier to use with existing Firebase configuration.
 * 
 * DANGER: This will permanently delete all data in your Firestore database!
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  setDoc,
  query,
  limit
} = require('firebase/firestore');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Firebase configuration (from src/lib/firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyBM0y7Ns-pmQPohdfa02jYMV7Qt09PFcnw",
  authDomain: "accountmanagement-42375.firebaseapp.com",
  projectId: "accountmanagement-42375",
  storageBucket: "accountmanagement-42375.firebasestorage.app",
  messagingSenderId: "421676153467",
  appId: "1:421676153467:web:156e63e368a861c16380de",
  measurementId: "G-NL7GTPKB2N"
};

// Configuration
const PROJECT_ID = 'accountmanagement-42375';
const BACKUP_DIR = './firestore-backup';
const LOG_FILE = './database-reset-log.txt';

// Collections to reset
const COLLECTIONS_TO_RESET = [
  'transactions',
  'users',
  'organizations', 
  'systemConfig',
  'businessTypes',
  'inventory',
  'test'
];

// Logger class
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.ensureLogFile();
  }

  ensureLogFile() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logEntry);
    
    try {
      fs.appendFileSync(this.logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  info(message) { this.log('INFO', message); }
  success(message) { this.log('SUCCESS', message); }
  warning(message) { this.log('WARNING', message); }
  error(message) { this.log('ERROR', message); }
}

// Initialize logger
const logger = new Logger(LOG_FILE);

// Initialize Firebase
let db;

function initializeFirebase() {
  try {
    logger.info('Initializing Firebase Client SDK...');
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    logger.success('Firebase Client SDK initialized successfully');
    return true;
  } catch (error) {
    logger.error(`Failed to initialize Firebase: ${error.message}`);
    return false;
  }
}

// Create backup directory
function createBackupDirectory() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      logger.info(`Created backup directory: ${BACKUP_DIR}`);
    }
    return true;
  } catch (error) {
    logger.error(`Failed to create backup directory: ${error.message}`);
    return false;
  }
}

// Analyze database
async function analyzeDatabase() {
  logger.info('Analyzing current database structure...');
  const analysis = {
    collectionsWithData: 0,
    totalDocuments: 0,
    collections: {}
  };

  for (const collectionName of COLLECTIONS_TO_RESET) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(query(collectionRef, limit(1000))); // Limit for performance
      const docCount = snapshot.size;
      
      if (docCount > 0) {
        analysis.collectionsWithData++;
        analysis.totalDocuments += docCount;
        analysis.collections[collectionName] = docCount;
        logger.info(`Collection '${collectionName}': ${docCount} documents`);
      } else {
        logger.info(`Collection '${collectionName}': empty or doesn't exist`);
      }
    } catch (error) {
      logger.warning(`Could not analyze collection '${collectionName}': ${error.message}`);
    }
  }

  logger.info(`Total collections with data: ${analysis.collectionsWithData}`);
  logger.info(`Total documents across all collections: ${analysis.totalDocuments}`);
  
  return analysis;
}

// Export collection data
async function exportCollectionData(collectionName) {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      logger.info(`Collection '${collectionName}' is empty, skipping backup`);
      return true;
    }

    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        data: doc.data()
      });
    });

    const backupFile = path.join(BACKUP_DIR, `${collectionName}-backup.json`);
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    
    logger.success(`Exported ${data.length} documents from '${collectionName}' to ${backupFile}`);
    return true;
  } catch (error) {
    logger.error(`Failed to export collection '${collectionName}': ${error.message}`);
    return false;
  }
}

// Delete all documents in a collection
async function deleteCollectionDocuments(collectionName) {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      logger.info(`Collection '${collectionName}' is already empty`);
      return true;
    }

    let deletedCount = 0;
    const deletePromises = [];
    
    snapshot.forEach(docSnapshot => {
      deletePromises.push(deleteDoc(doc(db, collectionName, docSnapshot.id)));
    });

    await Promise.all(deletePromises);
    deletedCount = snapshot.size;
    
    logger.success(`Deleted ${deletedCount} documents from collection '${collectionName}'`);
    return deletedCount;
  } catch (error) {
    logger.error(`Failed to delete documents from collection '${collectionName}': ${error.message}`);
    throw error;
  }
}

// Create empty collection with placeholder
async function createEmptyCollection(collectionName) {
  try {
    // Create a temporary document to ensure collection exists
    const tempDocRef = doc(db, collectionName, '__temp_placeholder__');
    await setDoc(tempDocRef, {
      _placeholder: true,
      _created: new Date().toISOString(),
      _note: 'Temporary document to initialize collection'
    });
    
    // Immediately delete the placeholder
    await deleteDoc(tempDocRef);
    
    logger.success(`Recreated empty collection: ${collectionName}`);
    return true;
  } catch (error) {
    logger.error(`Failed to recreate collection '${collectionName}': ${error.message}`);
    return false;
  }
}

// Confirmation prompts
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function askQuestion(rl, question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.trim());
    });
  });
}

async function confirmOperation(analysis) {
  const rl = createReadlineInterface();
  
  try {
    console.log('\n' + '='.repeat(80));
    console.log('⚠️  DANGER: This operation will PERMANENTLY DELETE all data in your Firestore database!');
    console.log('⚠️  This action is IRREVERSIBLE!');
    console.log('\nDatabase Analysis:');
    console.log(`- Total collections with data: ${analysis.collectionsWithData}`);
    console.log(`- Total documents to be deleted: ${analysis.totalDocuments}`);
    console.log('\nCollections to be reset:');
    COLLECTIONS_TO_RESET.forEach(name => {
      const count = analysis.collections[name] || 0;
      console.log(`  - ${name}: ${count} documents`);
    });
    console.log('\n' + '='.repeat(80));
    
    // First confirmation
    const firstConfirm = await askQuestion(rl, '\nDo you want to proceed with this DANGEROUS operation? Type "yes" to continue: ');
    if (firstConfirm !== 'yes') {
      logger.info('Operation cancelled by user at first confirmation');
      return false;
    }
    
    // Second confirmation - project ID
    const projectConfirm = await askQuestion(rl, `Please type the project ID "${PROJECT_ID}" to confirm: `);
    if (projectConfirm !== PROJECT_ID) {
      logger.error('Project ID confirmation failed');
      return false;
    }
    
    // Third confirmation - timestamp
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const timestampConfirm = await askQuestion(rl, `Final confirmation. Type "${timestamp}" to proceed: `);
    if (timestampConfirm !== timestamp) {
      logger.error('Timestamp confirmation failed');
      return false;
    }
    
    logger.success('All confirmations passed. Proceeding with database reset...');
    return true;
  } finally {
    rl.close();
  }
}

async function askForBackup() {
  const rl = createReadlineInterface();
  try {
    const answer = await askQuestion(rl, 'Do you want to create a backup before deletion? (recommended) [y/N]: ');
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
  } finally {
    rl.close();
  }
}

// Main execution
async function main() {
  const startTime = Date.now();
  
  try {
    console.log('\n' + '='.repeat(80));
    console.log('FIRESTORE DATABASE RESET OPERATION STARTED');
    console.log('='.repeat(80));
    
    // Initialize Firebase
    if (!initializeFirebase()) {
      process.exit(1);
    }
    
    // Create backup directory
    if (!createBackupDirectory()) {
      process.exit(1);
    }
    
    // Analyze database
    const analysis = await analyzeDatabase();
    
    // Get user confirmation
    const confirmed = await confirmOperation(analysis);
    if (!confirmed) {
      logger.info('Database reset operation cancelled by user');
      process.exit(0);
    }
    
    // Ask for backup
    const shouldBackup = await askForBackup();
    
    if (shouldBackup) {
      logger.info('Creating backup of existing data...');
      for (const collectionName of COLLECTIONS_TO_RESET) {
        if (analysis.collections[collectionName] > 0) {
          await exportCollectionData(collectionName);
        }
      }
      logger.success('Backup completed');
    }
    
    // Delete all documents
    logger.info('Starting deletion process...');
    let totalDeleted = 0;
    
    for (const collectionName of COLLECTIONS_TO_RESET) {
      if (analysis.collections[collectionName] > 0) {
        const deleted = await deleteCollectionDocuments(collectionName);
        totalDeleted += deleted;
      }
    }
    
    logger.success(`Deleted ${totalDeleted} total documents`);
    
    // Recreate empty collections
    logger.info('Recreating empty collections...');
    for (const collectionName of COLLECTIONS_TO_RESET) {
      await createEmptyCollection(collectionName);
    }
    
    logger.success('All collections recreated as empty');
    
    // Final verification
    logger.info('Performing final verification...');
    const finalAnalysis = await analyzeDatabase();
    
    if (finalAnalysis.totalDocuments === 0) {
      logger.success('✅ Database reset completed successfully!');
      logger.success('✅ All collections are now empty');
    } else {
      logger.warning(`⚠️ Warning: ${finalAnalysis.totalDocuments} documents still remain`);
    }
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\nNext steps:');
    console.log('1. Your application can now create new data');
    if (shouldBackup) {
      console.log('2. Check the backup files if you need to restore any data');
    }
    console.log('3. Review the log file for complete operation details');
    
    console.log('\n' + '='.repeat(80));
    console.log(`OPERATION COMPLETED IN ${duration} SECONDS`);
    console.log('='.repeat(80));
    
  } catch (error) {
    logger.error('Database reset operation failed');
    logger.error(`Error details: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  logger.warning('Process interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.warning('Process terminated');
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = {
  main,
  initializeFirebase,
  analyzeDatabase,
  deleteCollectionDocuments,
  createEmptyCollection
};