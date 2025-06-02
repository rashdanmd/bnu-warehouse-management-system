import { PurchaseOrder, OrderStatus } from "../../models/PurchaseOrder";

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

  public getOrderById(id: string): PurchaseOrder | undefined {
    return this.orders.find((order) => order.id === id);
  }

  public updateOrderStatus(id: string, newStatus: OrderStatus): void {
    const order = this.getOrderById(id);
    if (!order) throw new Error("Order not found");

    order.updateStatus(newStatus);
  }
}
