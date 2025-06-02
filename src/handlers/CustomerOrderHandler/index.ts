import inquirer from "inquirer";
import { CustomerOrderService, InventoryService } from "../../services";

export class CustomerOrderHandler {
  constructor(
    private customerOrderService: CustomerOrderService,
    private inventoryService: InventoryService
  ) {}

  public async showCustomerOrderMenu(): Promise<void> {
    const { action } = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "🧾 Customer Order Menu",
      choices: [
        { name: "🛒 Create Customer Order", value: "createOrder" },
        { name: "📋 View All Customer Orders", value: "viewOrders" },
        { name: "✅ Fulfill Customer Order", value: "fulfillOrder" },
        { name: "🔙 Go Back", value: "goBack" },
      ],
    });

    switch (action) {
      case "createOrder":
        await this.handleCreateOrder();
        break;
      case "viewOrders":
        this.handleViewOrders();
        break;
      case "fulfillOrder":
        await this.handleFulfillOrder();
        break;
      case "goBack":
        return;
    }

    await inquirer.prompt({
      name: "back",
      type: "input",
      message: "Press Enter to return to the Customer Order Menu.",
    });

    return this.showCustomerOrderMenu();
  }

  private async handleCreateOrder(): Promise<void> {
    const { customerName } = await inquirer.prompt({
      name: "customerName",
      type: "input",
      message: "Enter customer name:",
    });

    const items = [];

    let addMore = true;

    while (addMore) {
      const { productId, productName, quantity, unitPrice } =
        await inquirer.prompt([
          {
            name: "productId",
            type: "input",
            message: "Enter product ID:",
          },
          {
            name: "productName",
            type: "input",
            message: "Enter product name:",
          },
          {
            name: "quantity",
            type: "number",
            message: "Enter quantity:",
          },
          {
            name: "unitPrice",
            type: "number",
            message: "Enter unit price:",
          },
        ]);

      items.push({ productId, productName, quantity, unitPrice });

      const { confirm } = await inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Add another item?",
      });

      addMore = confirm;
    }

    const order = this.customerOrderService.createOrder(customerName, items);

    console.log("✅ Customer order created:");
    console.log(order.getOrderSummary());
  }

  private handleViewOrders(): void {
    const orders = this.customerOrderService.getAllOrders();

    if (orders.length === 0) {
      console.log("❌ No customer orders found.");
      return;
    }

    for (const order of orders) {
      console.log("\n----------------------------");
      console.log(order.getOrderSummary());
    }
  }

  private async handleFulfillOrder(): Promise<void> {
    const orders = this.customerOrderService
      .getAllOrders()
      .filter((o) => o.status === "Pending");

    if (orders.length === 0) {
      console.log("❌ No pending customer orders.");
      return;
    }

    const { selectedId } = await inquirer.prompt({
      name: "selectedId",
      type: "list",
      message: "Select order to fulfill:",
      choices: orders.map((o) => ({
        name: `${o.id} - ${o.customerName}`,
        value: o.id,
      })),
    });

    try {
      this.customerOrderService.fulfillOrder(selectedId);
      console.log("✅ Order fulfilled and inventory updated.");
    } catch (err) {
      console.log("❌ " + (err as Error).message);
    }
  }
}
