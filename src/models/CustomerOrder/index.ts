import { InventoryItem } from "../InventoryItem";

export type CustomerOrderStatus = "Pending" | "Fulfilled";

export class CustomerOrder {
  public readonly createdAt: Date = new Date();
  public fulfilledAt: Date | null = null;
  public status: CustomerOrderStatus = "Pending";

  constructor(
    public readonly id: string,
    public readonly customerName: string,
    public readonly items: {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }[]
  ) {}

  public getTotalCost(): number {
    return this.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }

  public fulfillOrder(inventory: Map<string, InventoryItem>): void {
    if (this.status === "Fulfilled") {
      throw new Error("Order already fulfilled.");
    }

    for (const item of this.items) {
      const inventoryItem = inventory.get(item.productId);
      if (!inventoryItem) {
        throw new Error(`Inventory item not found for ${item.productId}`);
      }

      if (inventoryItem.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.productName}`);
      }

      inventoryItem.decreaseStock(item.quantity);
    }

    this.status = "Fulfilled";
    this.fulfilledAt = new Date();
  }

  public getOrderSummary(): string {
    const lines = this.items
      .map(
        (item, i) =>
          `  ${i + 1}. ${item.productName} (${item.productId}) x${item.quantity} @ £${item.unitPrice.toFixed(2)}`
      )
      .join("\n");

    return `
🧾 Customer Order ID: ${this.id}
Customer: ${this.customerName}
Status: ${this.status}
Created At: ${this.createdAt.toLocaleString()}
${this.fulfilledAt ? `Fulfilled At: ${this.fulfilledAt.toLocaleString()}` : ""}
Items:
${lines}
💰 Total: £${this.getTotalCost().toFixed(2)}
    `.trim();
  }
}
