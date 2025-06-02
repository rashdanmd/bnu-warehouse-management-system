import { PurchaseOrder } from "../../models/PurchaseOrder";

export class PurchaseOrderService {
  private orders: PurchaseOrder[] = [];

  public createOrder(order: PurchaseOrder): void {
    this.orders.push(order);
  }

  public getOrdersBySupplier(supplierId: string): PurchaseOrder[] {
    return this.orders.filter((order) => order.supplierId === supplierId);
  }

  public getAllOrders(): PurchaseOrder[] {
    return [...this.orders];
  }
}
