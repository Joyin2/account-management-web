import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  location: string;
  unit: string;
  barcode?: string;
  notes?: string;
  imageUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface InventoryFormData {
  id?: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  location: string;
  unit: string;
  barcode?: string;
  notes?: string;
  images?: File[];
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string; // Reference to transaction, purchase order, etc.
  notes?: string;
  createdAt: Date;
  userId: string;
}

class InventoryService {

  // Get all inventory items for a user
  async getInventoryItems(userId: string): Promise<InventoryItem[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'inventory'),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as InventoryItem[];
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  // Get a single inventory item
  async getInventoryItem(itemId: string, userId: string): Promise<InventoryItem | null> {
    try {
      const docRef = doc(db, 'users', userId, 'inventory', itemId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as InventoryItem;
      }
      return null;
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  // Add a new inventory item
  async addInventoryItem(itemData: InventoryFormData, userId: string): Promise<string> {
    try {
      // Check if SKU already exists
      const existingSku = await this.checkSkuExists(itemData.sku, userId);
      if (existingSku) {
        throw new Error('SKU already exists. Please use a unique SKU.');
      }

      const now = Timestamp.now();
      const newItem = {
        ...itemData,
        userId,
        createdAt: now,
        updatedAt: now,
        imageUrls: [] // Will be updated after image upload
      };

      // Remove images from the data as they need separate handling
      delete newItem.images;
      delete newItem.id;

      // Remove undefined values to prevent Firestore errors
      Object.keys(newItem).forEach(key => {
        if (newItem[key as keyof typeof newItem] === undefined) {
          delete newItem[key as keyof typeof newItem];
        }
      });

      const docRef = await addDoc(collection(db, 'users', userId, 'inventory'), newItem);
      
      // Create initial stock movement record
      if (itemData.currentStock > 0) {
        await this.addStockMovement({
          itemId: docRef.id,
          itemName: itemData.name,
          itemSku: itemData.sku,
          type: 'in',
          quantity: itemData.currentStock,
          previousStock: 0,
          newStock: itemData.currentStock,
          reason: 'Initial stock',
          notes: 'Initial inventory setup',
          userId
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  }

  // Update an existing inventory item
  async updateInventoryItem(itemId: string, itemData: InventoryFormData, userId: string): Promise<void> {
    try {
      // Get current item to check for stock changes
      const currentItem = await this.getInventoryItem(itemId, userId);
      if (!currentItem) {
        throw new Error('Item not found');
      }

      // Check if SKU is being changed and if it already exists
      if (itemData.sku !== currentItem.sku) {
        const existingSku = await this.checkSkuExists(itemData.sku, userId, itemId);
        if (existingSku) {
          throw new Error('SKU already exists. Please use a unique SKU.');
        }
      }

      const updateData = {
        ...itemData,
        updatedAt: Timestamp.now()
      };

      // Remove images and id from update data
      delete updateData.images;
      delete updateData.id;

      // Remove undefined values to prevent Firestore errors
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const docRef = doc(db, 'users', userId, 'inventory', itemId);
      await updateDoc(docRef, updateData);

      // Create stock movement if stock quantity changed
      if (itemData.currentStock !== currentItem.currentStock) {
        const difference = itemData.currentStock - currentItem.currentStock;
        await this.addStockMovement({
          itemId,
          itemName: itemData.name,
          itemSku: itemData.sku,
          type: difference > 0 ? 'in' : 'out',
          quantity: Math.abs(difference),
          previousStock: currentItem.currentStock,
          newStock: itemData.currentStock,
          reason: 'Manual adjustment',
          notes: 'Stock updated via inventory form',
          userId
        });
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  // Delete an inventory item
  async deleteInventoryItem(itemId: string, userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Delete the inventory item
      const itemRef = doc(db, 'users', userId, 'inventory', itemId);
      batch.delete(itemRef);
      
      // Delete all related stock movements
        const movementsQuery = query(
          collection(db, 'users', userId, 'inventory', itemId, 'stockMovements')
        );
      const movementsSnapshot = await getDocs(movementsQuery);
      
      movementsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  // Check if SKU exists
  private async checkSkuExists(sku: string, userId: string, excludeItemId?: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'users', userId, 'inventory'),
        where('sku', '==', sku)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (excludeItemId) {
        return querySnapshot.docs.some(doc => doc.id !== excludeItemId);
      }
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking SKU existence:', error);
      return false;
    }
  }

  // Add stock movement record
  async addStockMovement(movementData: Omit<StockMovement, 'id' | 'createdAt'>): Promise<string> {
    try {
      const movement = {
        ...movementData,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'users', movementData.userId, 'inventory', movementData.itemId, 'stockMovements'), movement);
      return docRef.id;
    } catch (error) {
      console.error('Error adding stock movement:', error);
      throw error;
    }
  }

  // Get stock movements for an item
  async getStockMovements(itemId: string, userId: string): Promise<StockMovement[]> {
    try {
      const q = query(
      collection(db, 'users', userId, 'inventory', itemId, 'stockMovements'),
      orderBy('createdAt', 'desc')
    );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as StockMovement[];
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      throw error;
    }
  }

  // Update stock quantity (used when processing transactions)
  async updateStock(itemId: string, newQuantity: number, movementData: {
    type: 'in' | 'out' | 'adjustment';
    reason: string;
    reference?: string;
    notes?: string;
    userId: string;
  }): Promise<void> {
    try {
      const item = await this.getInventoryItem(itemId, movementData.userId);
      if (!item) {
        throw new Error('Item not found');
      }

      const previousStock = item.currentStock;
      const difference = newQuantity - previousStock;

      // Update the inventory item
    const itemRef = doc(db, 'users', movementData.userId, 'inventory', itemId);
      await updateDoc(itemRef, {
        currentStock: newQuantity,
        updatedAt: Timestamp.now()
      });

      // Add stock movement record
      await this.addStockMovement({
        itemId,
        itemName: item.name,
        itemSku: item.sku,
        type: movementData.type,
        quantity: Math.abs(difference),
        previousStock,
        newStock: newQuantity,
        reason: movementData.reason,
        reference: movementData.reference,
        notes: movementData.notes,
        userId: movementData.userId
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Find inventory item by SKU
  async findItemBySku(sku: string, userId: string): Promise<InventoryItem | null> {
    try {
      const q = query(
        collection(db, 'users', userId, 'inventory'),
        where('sku', '==', sku)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as InventoryItem;
    } catch (error) {
      console.error('Error finding item by SKU:', error);
      throw error;
    }
  }

  // Get low stock items
  async getLowStockItems(userId: string): Promise<InventoryItem[]> {
    try {
      const items = await this.getInventoryItems(userId);
      return items.filter(item => item.currentStock <= item.minimumStock);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }

  // Listen to inventory changes (real-time updates)
  subscribeToInventoryChanges(userId: string, callback: (items: InventoryItem[]) => void): () => void {
    const q = query(
      collection(db, 'users', userId, 'inventory'),
      orderBy('name')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as InventoryItem[];
      
      callback(items);
    }, (error) => {
      console.error('Error in inventory subscription:', error);
    });
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;