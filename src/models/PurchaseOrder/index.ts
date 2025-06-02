import { PurchaseItem } from "../PurchaseItem";

export type OrderStatus = "Pending" | "Shipped" | "Delivered";

export class PurchaseOrder {
  public shippedAt: Date | null = null;
  public deliveredAt: Date | null = null;

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

  public getOrderSummary(): string {
    let summary = `Order ID: ${this.id}
    Supplier: ${this.supplierId}
    Status: ${this.status}
    Total: £${this.getCostOfTotalOrder().toFixed(2)}`;

    if (this.shippedAt) {
      summary += `\nShipped At: ${this.shippedAt.toLocaleString()}`;
    }

    if (this.deliveredAt) {
      summary += `\nDelivered At: ${this.deliveredAt.toLocaleString()}`;
    }

    return summary;
  }
}
