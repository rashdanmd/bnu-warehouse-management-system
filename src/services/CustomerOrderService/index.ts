import { CustomerOrder } from "../../models/CustomerOrder";
import { InventoryService, FinanceService } from "../../services";

export class CustomerOrderService {
  private customerOrders: CustomerOrder[] = [];

  constructor(
    private inventoryService: InventoryService,
    private financeService: FinanceService
  ) {}

  public createOrder(
    customerName: string,
    items: {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }[]
  ): CustomerOrder {
    const order = new CustomerOrder(`ORD-${Date.now()}`, customerName, items);
    this.customerOrders.push(order);
    return order;
  }

  public getAllOrders(): CustomerOrder[] {
    return this.customerOrders;
  }

  public getOrderById(orderId: string): CustomerOrder | undefined {
    return this.customerOrders.find((order) => order.id === orderId);
  }

  public fulfillOrder(orderId: string): void {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error("Order not found.");

    const inventoryMap = this.inventoryService.getInventoryMap();
    order.fulfillOrder(inventoryMap);

    this.financeService.logTransaction(
      "CustomerPayment",
      order.getTotalCost(),
      `Customer order: ${order.id}`
    );
  }
}
