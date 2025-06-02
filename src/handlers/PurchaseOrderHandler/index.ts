import inquirer from "inquirer";
import { PurchaseItem, PurchaseOrder } from "../../models";
import { SupplierService, PurchaseOrderService } from "../../services";

export class PurchaseOrderHandler {
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService
  ) {}

  public async showPurchaseOrderMenu(): Promise<void> {
    const choices = [
      "📋 View all Purchase Orders",
      "🛒 Create Purchase Order",
      "🚚 Update Order Status",
      "🔙 Go Back",
    ];

    const { action } = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "📦 Purchase Order Management Menu",
      choices,
    });

    switch (action) {
      case "📋 View all Purchase Orders":
        this.displayAllOrders();
        break;

      case "🛒 Create Purchase Order":
        await this.handleCreateOrder();
        break;

      case "🚚 Update Order Status":
        await this.updateOrderStatus();
        break;

      case "🔙 Go Back":
        return;
    }

    await inquirer.prompt({
      name: "back",
      type: "input",
      message: "Press Enter to return to the Purchase Order Menu.",
    });

    return this.showPurchaseOrderMenu();
  }

  private displayAllOrders(): void {
    const orders = this.purchaseOrderService.getAllOrders();
    if (orders.length === 0) {
      console.log("❌ No purchase orders found.");
      return;
    }

    for (const order of orders) {
      console.log("\n------------------------");
      console.log(order.getOrderSummary());
    }
  }

  private async handleCreateOrder(): Promise<void> {
    const suppliers = this.supplierService.getAllSuppliers();

    if (suppliers.length === 0) {
      console.log("❌ No suppliers available.");
      return;
    }

    const { supplierId } = await inquirer.prompt({
      name: "supplierId",
      type: "list",
      message: "Select a supplier:",
      choices: suppliers.map((s) => ({
        name: `${s.name} (${s.id})`,
        value: s.id,
      })),
    });

    const items: PurchaseItem[] = [];

    let addMore = true;
    while (addMore) {
      const { productName, quantity, unitPrice } = await inquirer.prompt([
        {
          name: "productName",
          type: "input",
          message: "Enter product name:",
        },
        {
          name: "quantity",
          type: "number",
          message: "Enter quantity:",
          validate: (value) => (value ?? 0) > 0 || "Must be greater than 0",
        },
        {
          name: "unitPrice",
          type: "number",
          message: "Enter unit price:",
          validate: (value) => (value ?? 0) > 0 || "Must be greater than 0",
        },
      ]);

      items.push(
        new PurchaseItem(productName, productName, quantity, unitPrice)
      );

      const { confirm } = await inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Add another item?",
      });

      addMore = confirm;
    }

    const order = new PurchaseOrder(`PO-${Date.now()}`, supplierId, items);
    this.purchaseOrderService.createOrder(order);

    const supplier = this.supplierService.getSupplierById(supplierId);
    supplier?.addOrder(order);

    console.log("✅ Purchase order created successfully!");
    console.log(order.getOrderSummary());
  }

  private async updateOrderStatus(): Promise<void> {
    const orders = this.purchaseOrderService.getAllOrders();
    if (orders.length === 0) {
      console.log("❌ No orders to update.");
      return;
    }

    const { selectedId } = await inquirer.prompt({
      name: "selectedId",
      type: "list",
      message: "Select an order:",
      choices: orders.map((order) => ({
        name: order.getOrderSummary(),
        value: order.id,
      })),
    });

    const { newStatus } = await inquirer.prompt({
      name: "newStatus",
      type: "list",
      message: "Select new status:",
      choices: ["Pending", "Shipped", "Delivered"],
    });

    try {
      this.purchaseOrderService.updateOrderStatus(selectedId, newStatus);
      console.log("✅ Order status updated successfully.");
    } catch (error) {
      console.log("❌ " + (error as Error).message);
    }
  }
}
