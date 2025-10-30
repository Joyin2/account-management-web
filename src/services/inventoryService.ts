import { supabase } from '@/lib/supabase';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  unit_price: number;
  cost_price: number;
  supplier: string;
  location: string;
  unit: string;
  barcode?: string;
  notes?: string;
  image_urls?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface InventoryFormData {
  id?: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  unit_price: number;
  cost_price: number;
  supplier: string;
  location: string;
  unit: string;
  barcode?: string;
  notes?: string;
  image_urls?: string[];
}

export interface StockMovement {
  id: string;
  inventory_item_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit_price?: number;
  reference_number?: string;
  notes?: string;
  created_at: string;
  user_id: string;
}

export interface StockMovementFormData {
  inventory_item_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit_price?: number;
  reference_number?: string;
  notes?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  user_id: string;
}

export interface InventorySupplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
  user_id: string;
}

export interface InventoryReport {
  total_items: number;
  total_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  categories: { [key: string]: number };
  recent_movements: StockMovement[];
}

// Inventory Items
export const createInventoryItem = async (data: InventoryFormData, userId: string): Promise<InventoryItem> => {
  try {
    const now = new Date().toISOString();
    const itemData = {
      ...data,
      user_id: userId,
      created_at: now,
      updated_at: now
    };

    const { data: item, error } = await supabase
      .from('inventory_items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;
    return item;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

export const updateInventoryItem = async (id: string, data: Partial<InventoryFormData>): Promise<void> => {
  try {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('inventory_items')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

export const getInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error getting inventory item:', error);
    throw error;
  }
};

export const getInventoryItems = async (userId: string): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting inventory items:', error);
    throw error;
  }
};

export const getInventoryItemsByCategory = async (userId: string, category: string): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting inventory items by category:', error);
    throw error;
  }
};

export const getLowStockItems = async (userId: string): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .filter('current_stock', 'lte', 'minimum_stock')
      .order('current_stock');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting low stock items:', error);
    throw error;
  }
};

export const searchInventoryItems = async (userId: string, searchTerm: string): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,barcode.ilike.%${searchTerm}%`)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching inventory items:', error);
    throw error;
  }
};

// Stock Movements
export const createStockMovement = async (data: StockMovementFormData, userId: string): Promise<StockMovement> => {
  try {
    const { data: result, error } = await supabase.rpc('create_stock_movement', {
      p_inventory_item_id: data.inventory_item_id,
      p_movement_type: data.movement_type,
      p_quantity: data.quantity,
      p_unit_price: data.unit_price,
      p_reference_number: data.reference_number,
      p_notes: data.notes,
      p_user_id: userId
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating stock movement:', error);
    throw error;
  }
};

export const getStockMovements = async (userId: string, inventoryItemId?: string): Promise<StockMovement[]> => {
  try {
    let query = supabase
      .from('stock_movements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (inventoryItemId) {
      query = query.eq('inventory_item_id', inventoryItemId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting stock movements:', error);
    throw error;
  }
};

export const getRecentStockMovements = async (userId: string, limit: number = 10): Promise<StockMovement[]> => {
  try {
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting recent stock movements:', error);
    throw error;
  }
};

// Categories
export const createInventoryCategory = async (name: string, description: string, userId: string): Promise<InventoryCategory> => {
  try {
    const categoryData = {
      name,
      description,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('inventory_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating inventory category:', error);
    throw error;
  }
};

export const getInventoryCategories = async (userId: string): Promise<InventoryCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting inventory categories:', error);
    throw error;
  }
};

export const deleteInventoryCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('inventory_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting inventory category:', error);
    throw error;
  }
};

// Suppliers
export const createInventorySupplier = async (data: Omit<InventorySupplier, 'id' | 'created_at'>, userId: string): Promise<InventorySupplier> => {
  try {
    const supplierData = {
      ...data,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    const { data: supplier, error } = await supabase
      .from('inventory_suppliers')
      .insert(supplierData)
      .select()
      .single();

    if (error) throw error;
    return supplier;
  } catch (error) {
    console.error('Error creating inventory supplier:', error);
    throw error;
  }
};

export const getInventorySuppliers = async (userId: string): Promise<InventorySupplier[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_suppliers')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting inventory suppliers:', error);
    throw error;
  }
};

export const updateInventorySupplier = async (id: string, data: Partial<Omit<InventorySupplier, 'id' | 'created_at' | 'user_id'>>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('inventory_suppliers')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating inventory supplier:', error);
    throw error;
  }
};

export const deleteInventorySupplier = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('inventory_suppliers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting inventory supplier:', error);
    throw error;
  }
};

// Reports and Analytics
export const getInventoryReport = async (userId: string): Promise<InventoryReport> => {
  try {
    const { data, error } = await supabase.rpc('get_inventory_report', {
      p_user_id: userId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting inventory report:', error);
    throw error;
  }
};

export const getInventoryValueByCategory = async (userId: string): Promise<{ [key: string]: number }> => {
  try {
    const { data, error } = await supabase.rpc('get_inventory_value_by_category', {
      p_user_id: userId
    });

    if (error) throw error;
    return data || {};
  } catch (error) {
    console.error('Error getting inventory value by category:', error);
    throw error;
  }
};

export const getStockMovementTrends = async (userId: string, days: number = 30): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_stock_movement_trends', {
      p_user_id: userId,
      p_days: days
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting stock movement trends:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToInventoryItems = (userId: string, callback: (items: InventoryItem[]) => void) => {
  return supabase
    .channel('inventory_items')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'inventory_items',
        filter: `user_id=eq.${userId}`
      }, 
      () => {
        getInventoryItems(userId).then(callback);
      }
    )
    .subscribe();
};

export const subscribeToStockMovements = (userId: string, callback: (movements: StockMovement[]) => void) => {
  return supabase
    .channel('stock_movements')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'stock_movements',
        filter: `user_id=eq.${userId}`
      }, 
      () => {
        getStockMovements(userId).then(callback);
      }
    )
    .subscribe();
};

// Bulk operations
export const bulkUpdateInventoryItems = async (updates: Array<{ id: string; data: Partial<InventoryFormData> }>): Promise<void> => {
  try {
    const { error } = await supabase.rpc('bulk_update_inventory_items', {
      updates: updates.map(update => ({
        id: update.id,
        ...update.data,
        updated_at: new Date().toISOString()
      }))
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error bulk updating inventory items:', error);
    throw error;
  }
};

export const bulkCreateStockMovements = async (movements: StockMovementFormData[], userId: string): Promise<void> => {
  try {
    const movementData = movements.map(movement => ({
      ...movement,
      user_id: userId,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('stock_movements')
      .insert(movementData);

    if (error) throw error;
  } catch (error) {
    console.error('Error bulk creating stock movements:', error);
    throw error;
  }
};