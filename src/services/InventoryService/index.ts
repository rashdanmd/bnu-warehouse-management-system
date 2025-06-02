import { InventoryItem } from "../../models/InventoryItem/index";

export class InventoryService {
  private inventoryMap = new Map<string, InventoryItem>();

  public addNewItem(item: InventoryItem): void {
    if (this.inventoryMap.has(item.id)) {
      throw new Error(`Item with ID ${item.id} already exists.`);
    }
    this.inventoryMap.set(item.id, item);
  }

  public receiveStock(productId: string, quantity: number): void {
    const item = this.inventoryMap.get(productId);
    if (!item) {
      throw new Error(`Item with ID ${productId} not found in inventory.`);
    }
    item.increaseStock(quantity);
  }

  public reduceStock(productId: string, quantity: number): void {
    const item = this.inventoryMap.get(productId);
    if (!item) {
      throw new Error(`Item with ID ${productId} not found in inventory.`);
    }
    item.decreaseStock(quantity);
  }

  public getLowStockItems(): InventoryItem[] {
    return Array.from(this.inventoryMap.values()).filter((item) =>
      item.isLowStock()
    );
  }

  public getItem(productId: string): InventoryItem | undefined {
    return this.inventoryMap.get(productId);
  }

  public listAllItems(): InventoryItem[] {
    return Array.from(this.inventoryMap.values());
  }

  public getInventoryMap(): Map<string, InventoryItem> {
    return this.inventoryMap;
  }
}
