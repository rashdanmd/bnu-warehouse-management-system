import { PurchaseItem } from "../PurchaseItem";
import { InventoryItem } from "../InventoryItem";

export type OrderStatus = "Pending" | "Shipped" | "Delivered";

export class PurchaseOrder {
  public shippedAt: Date | null = null;
  public deliveredAt: Date | null = null;
  private inventoryUpdated = false;

  constructor(
    public readonly id: string,
    public readonly supplierId: string,
    public readonly items: PurchaseItem[],
    public readonly orderDate: Date = new Date(),
    public status: OrderStatus = "Pending"
  ) {}

  public getCostOfTotalOrder(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  public updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;

    this.shippedAt = newStatus === "Shipped" ? new Date() : this.shippedAt;
    this.deliveredAt =
      newStatus === "Delivered" ? new Date() : this.deliveredAt;
  }

  public applyToInventory(inventoryMap: Map<string, InventoryItem>): void {
    if (this.status !== "Delivered") {
      throw new Error("Order must be delivered before updating inventory");
    }

    if (this.inventoryUpdated) {
      throw new Error("Inventory already updated for this order");
    }

    this.items.forEach((item) => {
      const inventoryItem = inventoryMap.get(item.productId);
      if (!inventoryItem) {
        throw new Error(
          `No inventory item found for product ID: ${item.productId}`
        );
      }
      inventoryItem.increaseStock(item.quantity);
    });

    this.inventoryUpdated = true;
  }

  public getOrderSummary(): string {
    const itemLines = this.items
      .map((item, index) => {
        return `  ${index + 1}. ${item.productName}\n     Quantity: ${item.quantity}\n     Unit Price: £${item.unitPrice.toFixed(2)}\n     Total: £${item.getTotalPrice().toFixed(2)}`;
      })
      .join("\n\n");

    let summary = `
  ══════════════════════════════════════════════════════
                       PURCHASE ORDER
  ══════════════════════════════════════════════════════
  Order ID    : ${this.id}
  Supplier ID : ${this.supplierId}
  Status      : ${this.status}
  Order Date  : ${this.orderDate.toLocaleDateString()}
  
  🧾 Items Ordered:
  ${itemLines}
  
  💰 Total Cost: £${this.getCostOfTotalOrder().toFixed(2)}
  ══════════════════════════════════════════════════════
  `;

    if (this.shippedAt) {
      summary += `Shipped At   : ${this.shippedAt.toLocaleString()}\n`;
    }

    if (this.deliveredAt) {
      summary += `Delivered At : ${this.deliveredAt.toLocaleString()}\n`;
    }

    return summary.trim();
  }
}
