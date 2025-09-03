import { inventoryService, InventoryItem, InventoryFormData } from './inventoryService';
import { Transaction } from '@/lib/api/transactions';
import { FirestoreTransaction } from '@/lib/firestore/transactions';

// Enhanced transaction interface with optional inventory data
interface EnhancedTransaction extends FirestoreTransaction {
  inventoryData?: {
    sku?: string;
    category?: string;
    minimumStock?: number;
    maximumStock?: number;
    unitPrice?: number;
    location?: string;
    unit?: string;
    barcode?: string;
  };
}

/**
 * Service to integrate accounting transactions with inventory management
 * This handles automatic inventory updates when transactions are processed
 */
class AccountingInventoryIntegration {
  
  /**
   * Process a transaction and update inventory accordingly
   * @param transaction - The transaction to process
   * @param userId - The user ID
   */
  async processTransactionInventoryUpdate(transaction: Transaction, userId: string): Promise<void> {
    try {
      // Only process transactions that affect inventory
      if (!this.shouldUpdateInventory(transaction)) {
        return;
      }

      // Extract inventory-related items from transaction
      const inventoryUpdates = await this.extractInventoryUpdates(transaction, userId);
      
      // Apply inventory updates
      for (const update of inventoryUpdates) {
        await this.applyInventoryUpdate(update, transaction, userId);
      }
    } catch (error) {
      console.error('Error processing transaction inventory update:', error);
      throw error;
    }
  }

  /**
   * Create inventory item from accounting "Buy - Inventory" transaction
   * @param transaction - The Firestore transaction data
   * @param userId - The user ID
   */
  async createInventoryFromAccountingTransaction(transaction: FirestoreTransaction, userId: string): Promise<string | null> {
    try {
      // Only process BUY transactions with inventory subType
      if (transaction.type !== 'BUY' || transaction.subType !== 'inventory') {
        return null;
      }

      // Check if required fields are present
      if (!transaction.productName || !transaction.quantity || !transaction.price) {
        console.warn('Missing required fields for inventory creation:', {
          productName: transaction.productName,
          quantity: transaction.quantity,
          price: transaction.price
        });
        return null;
      }

      // Use enhanced inventory data if available, otherwise generate defaults
      const enhancedTransaction = transaction as EnhancedTransaction;
      const enhancedData = enhancedTransaction.inventoryData;
      const sku = enhancedData?.sku || this.generateSkuFromProductName(transaction.productName);
      
      // Check if item with this SKU already exists
      const existingItem = await inventoryService.findItemBySku(sku, userId);
      if (existingItem) {
        // Update existing item stock
        await inventoryService.updateStock(existingItem.id, existingItem.currentStock + transaction.quantity, {
          type: 'in',
          reason: 'Purchase from accounting transaction',
          reference: `TXN-${transaction.id}`,
          notes: `Vendor: ${transaction.vendorName || 'Unknown'}, Amount: ${transaction.amount}`,
          userId
        });
        return existingItem.id;
      }

      // Create new inventory item with enhanced data if available
      const inventoryData: InventoryFormData = {
        name: transaction.productName,
        sku: sku,
        category: enhancedData?.category || 'raw-materials',
        description: transaction.remarks || `Purchased from ${transaction.vendorName || 'vendor'}`,
        currentStock: transaction.quantity,
        minimumStock: enhancedData?.minimumStock || Math.max(1, Math.floor(transaction.quantity * 0.1)),
        maximumStock: enhancedData?.maximumStock || transaction.quantity * 5,
        unitPrice: enhancedData?.unitPrice || transaction.price,
        costPrice: transaction.price,
        supplier: transaction.vendorName || 'Unknown Vendor',
        location: enhancedData?.location || 'warehouse-a',
        unit: enhancedData?.unit || this.extractUnitFromQuantity(transaction.quantity.toString()) || 'pcs',
        barcode: enhancedData?.barcode,
        notes: `Created from accounting transaction on ${transaction.date.toDate().toLocaleDateString()}. Payment: ${transaction.paymentMethod}${transaction.gstApplicable ? ', GST applicable' : ''}`
      };

      const itemId = await inventoryService.addInventoryItem(inventoryData, userId);
      console.log(`Created inventory item ${itemId} from accounting transaction`);
      return itemId;
    } catch (error) {
      console.error('Error creating inventory from accounting transaction:', error);
      throw error;
    }
  }

  /**
   * Generate SKU from product name
   */
  private generateSkuFromProductName(productName: string): string {
    const prefix = productName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 3)
      .padEnd(3, 'X');
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }

  /**
   * Extract unit from quantity string (e.g., "50 pieces" -> "pcs")
   */
  private extractUnitFromQuantity(quantityStr: string): string | null {
    const unitMappings: { [key: string]: string } = {
      'piece': 'pcs',
      'pieces': 'pcs',
      'pcs': 'pcs',
      'kg': 'kg',
      'kilogram': 'kg',
      'kilograms': 'kg',
      'gram': 'gm',
      'grams': 'gm',
      'gm': 'gm',
      'liter': 'ltr',
      'liters': 'ltr',
      'ltr': 'ltr',
      'ml': 'ml',
      'milliliter': 'ml',
      'milliliters': 'ml',
      'meter': 'mtr',
      'meters': 'mtr',
      'mtr': 'mtr',
      'cm': 'cm',
      'centimeter': 'cm',
      'centimeters': 'cm',
      'box': 'box',
      'boxes': 'box',
      'pack': 'pack',
      'packs': 'pack'
    };

    const lowerStr = quantityStr.toLowerCase();
    for (const [key, value] of Object.entries(unitMappings)) {
      if (lowerStr.includes(key)) {
        return value;
      }
    }
    return null;
  }

  /**
   * Determine if a transaction should update inventory
   */
  private shouldUpdateInventory(transaction: Transaction): boolean {
    // Update inventory for sales (reduce stock) and purchases (increase stock)
    // For Transaction interface, check if it's related to inventory
    return transaction.category === 'Sales' || transaction.category === 'Inventory' || transaction.category === 'Purchases';
  }

  /**
   * Extract inventory updates from transaction description and amount
   */
  private async extractInventoryUpdates(transaction: Transaction, userId: string): Promise<InventoryUpdate[]> {
    const updates: InventoryUpdate[] = [];
    
    // Try to parse inventory items from transaction description
    const inventoryItems = await this.parseInventoryFromDescription(transaction.description, userId);
    
    if (inventoryItems.length === 0) {
      // If no specific items found, try to match by transaction description
      const matchedItem = await this.findItemByDescription(transaction.description, userId);
      if (matchedItem) {
        inventoryItems.push({
          item: matchedItem,
          quantity: 1, // Default quantity
          unitPrice: transaction.amount
        });
      }
    }

    for (const inventoryItem of inventoryItems) {
      const isSale = transaction.type === 'income' || transaction.category === 'Sales';
      const quantityChange = isSale ? -inventoryItem.quantity : inventoryItem.quantity;
      const newStock = inventoryItem.item.currentStock + quantityChange;
      
      // Ensure stock doesn't go negative
      if (newStock < 0 && isSale) {
        console.warn(`Insufficient stock for item ${inventoryItem.item.name}. Current: ${inventoryItem.item.currentStock}, Required: ${inventoryItem.quantity}`);
        // You might want to throw an error here or handle this case differently
        continue;
      }

      updates.push({
        itemId: inventoryItem.item.id,
        newQuantity: Math.max(0, newStock),
        movementType: isSale ? 'out' : 'in',
        reason: isSale ? 'Sale transaction' : 'Purchase transaction',
        reference: `TXN-${transaction.id}`,
        notes: `Auto-updated from ${transaction.type} transaction: ${transaction.description}`
      });
    }

    return updates;
  }

  /**
   * Parse inventory items from transaction description
   * This looks for patterns like "SKU001 x2" or "Product Name (5 units)"
   */
  private async parseInventoryFromDescription(description: string, userId: string): Promise<ParsedInventoryItem[]> {
    const items: ParsedInventoryItem[] = [];
    
    // Pattern 1: SKU followed by quantity (e.g., "SKU001 x2", "SKU001 qty:5")
    const skuPattern = /([A-Z0-9-]+)\s*(?:x|qty:?|quantity:?)\s*(\d+)/gi;
    let match;
    
    while ((match = skuPattern.exec(description)) !== null) {
      const sku = match[1];
      const quantity = parseInt(match[2]);
      
      const item = await inventoryService.findItemBySku(sku, userId);
      if (item) {
        items.push({
          item,
          quantity,
          unitPrice: item.unitPrice
        });
      }
    }

    // Pattern 2: Product name with quantity in parentheses (e.g., "Product A (3 units)")
    if (items.length === 0) {
      const namePattern = /(.+?)\s*\((\d+)\s*(?:units?|pcs?|pieces?)\)/gi;
      
      while ((match = namePattern.exec(description)) !== null) {
        const productName = match[1].trim();
        const quantity = parseInt(match[2]);
        
        const item = await this.findItemByName(productName, userId);
        if (item) {
          items.push({
            item,
            quantity,
            unitPrice: item.unitPrice
          });
        }
      }
    }

    return items;
  }

  /**
   * Find inventory item by partial name match
   */
  private async findItemByDescription(description: string, userId: string): Promise<InventoryItem | null> {
    try {
      const allItems = await inventoryService.getInventoryItems(userId);
      
      // Try exact name match first
      let matchedItem = allItems.find(item => 
        description.toLowerCase().includes(item.name.toLowerCase())
      );
      
      // If no exact match, try SKU match
      if (!matchedItem) {
        matchedItem = allItems.find(item => 
          item.sku && description.toUpperCase().includes(item.sku.toUpperCase())
        );
      }
      
      return matchedItem || null;
    } catch (error) {
      console.error('Error finding item by description:', error);
      return null;
    }
  }

  /**
   * Find inventory item by name
   */
  private async findItemByName(name: string, userId: string): Promise<InventoryItem | null> {
    try {
      const allItems = await inventoryService.getInventoryItems(userId);
      return allItems.find(item => 
        item.name.toLowerCase() === name.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('Error finding item by name:', error);
      return null;
    }
  }

  /**
   * Apply inventory update
   */
  private async applyInventoryUpdate(
    update: InventoryUpdate, 
    transaction: Transaction, 
    userId: string
  ): Promise<void> {
    try {
      await inventoryService.updateStock(update.itemId, update.newQuantity, {
        type: update.movementType,
        reason: update.reason,
        reference: update.reference,
        notes: update.notes,
        userId
      });
    } catch (error) {
      console.error(`Error updating inventory for item ${update.itemId}:`, error);
      throw error;
    }
  }

  /**
   * Get inventory impact preview for a transaction
   * This can be used to show users what inventory changes will occur
   */
  async getInventoryImpactPreview(transaction: Transaction, userId: string): Promise<InventoryImpactPreview[]> {
    try {
      const updates = await this.extractInventoryUpdates(transaction, userId);
      
      return updates.map(update => ({
        itemId: update.itemId,
        currentStock: 0, // Will be filled by calling code
        newStock: update.newQuantity,
        change: update.movementType === 'in' ? '+' : '-',
        reason: update.reason
      }));
    } catch (error) {
      console.error('Error getting inventory impact preview:', error);
      return [];
    }
  }

  /**
   * Validate if a transaction can be processed without causing negative inventory
   */
  async validateInventoryAvailability(transaction: Transaction, userId: string): Promise<ValidationResult> {
    try {
      // Only validate for sales transactions (income type or Sales category)
      const isSale = transaction.type === 'income' || transaction.category === 'Sales';
      if (!isSale) {
        return { isValid: true, issues: [] };
      }

      const updates = await this.extractInventoryUpdates(transaction, userId);
      const issues: string[] = [];

      for (const update of updates) {
        if (update.newQuantity < 0) {
          const item = await inventoryService.getInventoryItem(update.itemId, userId);
          if (item) {
            issues.push(`Insufficient stock for ${item.name}. Available: ${item.currentStock}, Required: ${Math.abs(update.newQuantity - item.currentStock)}`);
          }
        }
      }

      return {
        isValid: issues.length === 0,
        issues
      };
    } catch (error) {
      console.error('Error validating inventory availability:', error);
      return {
        isValid: false,
        issues: ['Error validating inventory availability']
      };
    }
  }
}

// Types
interface InventoryUpdate {
  itemId: string;
  newQuantity: number;
  movementType: 'in' | 'out' | 'adjustment';
  reason: string;
  reference: string;
  notes: string;
}

interface ParsedInventoryItem {
  item: InventoryItem;
  quantity: number;
  unitPrice: number;
}

interface InventoryImpactPreview {
  itemId: string;
  currentStock: number;
  newStock: number;
  change: '+' | '-';
  reason: string;
}

interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

export const accountingInventoryIntegration = new AccountingInventoryIntegration();
export default accountingInventoryIntegration;