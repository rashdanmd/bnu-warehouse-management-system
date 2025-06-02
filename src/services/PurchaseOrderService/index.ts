import { PurchaseOrder, OrderStatus, PurchaseItem } from "../../models";
import { FinanceService } from "../FinanceService";

export class PurchaseOrderService {
  private orders: PurchaseOrder[] = [];

  constructor(private financeService: FinanceService) {}

  public createOrder(supplierId: string, items: PurchaseItem[]): PurchaseOrder {
    const order = new PurchaseOrder(`PO-${Date.now()}`, supplierId, items);
    this.orders.push(order);
    return order;
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

    const wasDelivered = order.status === "Delivered";

    order.updateStatus(newStatus);

    if (newStatus === "Delivered" && !wasDelivered) {
      this.financeService.logTransaction(
        "SupplierPayment",
        order.getCostOfTotalOrder(),
        `Supplier order: ${order.id}`
      );
    }
  }
}
