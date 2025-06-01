import { PurchaseItem } from "../PurchaseItem";

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export class PurchaseOrder {
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

  public updtateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  public getOrderSummary(): string {
    return `Order ID: ${this.id}\nSupplier: ${this.supplierId}\nStatus: ${this.status}\nTotal: £${this.getCostOfTotalOrder().toFixed(2)}`;
  }
}
