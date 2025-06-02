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
      "✍🏻 Create Purchase Order",
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

      case "✍🏻 Create Purchase Order":
        await this.handleCreateOrder();
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

    // Maintain supplier’s local order history
    const supplier = this.supplierService.getSupplierById(supplierId);
    supplier?.addOrder(order);

    console.log("✅ Purchase order created successfully!");
    console.log(order.getOrderSummary());
  }
}
