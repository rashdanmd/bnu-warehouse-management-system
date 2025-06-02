import { InventoryItem } from "../../models/InventoryItem/index";

export class InventoryService {
  private inventoryMap = new Map<string, InventoryItem>();

  /**
   * Adds a new item to the inventory.
   * If the item already exists, it throws an error.
   */
  public addNewItem(item: InventoryItem): void {
    if (this.inventoryMap.has(item.id)) {
      throw new Error(`Item with ID ${item.id} already exists.`);
    }
    this.inventoryMap.set(item.id, item);
  }

  /**
   * Increases stock for an existing inventory item.
   */
  public receiveStock(productId: string, quantity: number): void {
    const item = this.inventoryMap.get(productId);
    if (!item) {
      throw new Error(`Item with ID ${productId} not found in inventory.`);
    }
    item.increaseStock(quantity);
  }

  /**
   * Decreases stock for an existing inventory item (e.g., on customer sale).
   */
  public reduceStock(productId: string, quantity: number): void {
    const item = this.inventoryMap.get(productId);
    if (!item) {
      throw new Error(`Item with ID ${productId} not found in inventory.`);
    }
    item.decreaseStock(quantity);
  }

  /**
   * Returns all items below their reorder level.
   */
  public getLowStockItems(): InventoryItem[] {
    return Array.from(this.inventoryMap.values()).filter((item) =>
      item.isLowStock()
    );
  }

  /**
   * Gets an item by ID.
   */
  public getItem(productId: string): InventoryItem | undefined {
    return this.inventoryMap.get(productId);
  }

  /**
   * Returns the full inventory as an array.
   */
  public listAllItems(): InventoryItem[] {
    return Array.from(this.inventoryMap.values());
  }

  /**
   * Provides the internal map for use with PurchaseOrder.applyToInventory().
   */
  public getInventoryMap(): Map<string, InventoryItem> {
    return this.inventoryMap;
  }
}
