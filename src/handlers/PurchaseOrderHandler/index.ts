import inquirer from "inquirer";
import { PurchaseItem, PurchaseOrder } from "../../models";
import {
  SupplierService,
  PurchaseOrderService,
  InventoryService,
  FinanceService,
} from "../../services";

export class PurchaseOrderHandler {
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService,
    private inventoryService: InventoryService,
    private financeService: FinanceService
  ) {}

  public async showPurchaseOrderMenu(): Promise<void> {
    const choices = [
      { name: "📋 View all Purchase Orders", value: "viewOrders" },
      { name: "🛒 Create Purchase Order", value: "createOrder" },
      { name: "🚚 Update Order Status", value: "updateStatus" },
      { name: "🔙 Go Back", value: "goBack" },
    ];

    const { action } = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "📦 Purchase Order Management Menu",
      choices,
    });

    switch (action) {
      case "viewOrders":
        this.displayAllOrders();
        break;

      case "createOrder":
        await this.handleCreateOrder();
        break;

      case "updateStatus":
        await this.updateOrderStatus();
        break;

      case "goBack":
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
      choices: suppliers.map((supplier) => ({
        name: `${supplier.name} (${supplier.id})`,
        value: supplier.id,
      })),
    });

    const items: PurchaseItem[] = [];
    let addMore = true;

    while (addMore) {
      const { productId, productName, quantity, unitPrice } =
        await inquirer.prompt([
          {
            name: "productId",
            type: "input",
            message: "Enter product ID (must match existing inventory item):",
            validate: (value: string) =>
              value.trim().length > 0 || "Product ID is required.",
          },
          {
            name: "productName",
            type: "input",
            message: "Enter product name:",
            validate: (value: string) => {
              if (!value || value.trim().length === 0) {
                return "Please enter a product name.";
              }
              if (value.trim().length < 2) {
                return "Product name must be at least 2 characters.";
              }
              if (value.length > 50) {
                return "Product name must be under 50 characters.";
              }
              return true;
            },
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

      items.push(new PurchaseItem(productId, productName, unitPrice, quantity));

      const { confirm } = await inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Add another item?",
      });

      addMore = confirm;
    }

    const order = this.purchaseOrderService.createOrder(supplierId, items);

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
        name: `ID: ${order.id} | Status: ${order.status}`,
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
      const order = this.purchaseOrderService.getOrderById(selectedId);

      if (!order) {
        console.log("❌ Order not found.");
        return;
      }

      order.updateStatus(newStatus);

      if (newStatus === "Delivered") {
        try {
          order.applyToInventory(this.inventoryService.getInventoryMap());

          this.financeService.logTransaction(
            "SupplierPayment",
            order.getCostOfTotalOrder(),
            `Supplier order: ${order.id}`
          );

          console.log("✅ Inventory successfully updated.");
        } catch (err) {
          console.log(`❌ Inventory update warning: ${(err as Error).message}`);
        }
      }

      console.log("✅ Order status updated successfully.");
    } catch (error) {
      console.log("❌ " + (error as Error).message);
    }
  }
}
