import inquirer from "inquirer";
import { InventoryService } from "../../services/InventoryService";
import { InventoryItem } from "../../models/InventoryItem";

export class InventoryHandler {
  constructor(private inventoryService: InventoryService) {}

  public async showInventoryMenu(): Promise<void> {
    const choices = [
      { name: "📦 Add New Inventory Item", value: "addItem" },
      { name: "➕ Receive Stock", value: "receiveStock" },
      { name: "📉 View All Inventory", value: "viewAll" },
      { name: "⚠️ View Low Stock Items", value: "lowStock" },
      { name: "🔙 Go Back", value: "goBack" },
    ];

    const { action } = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "🏷️ Inventory Management Menu",
      choices,
    });

    switch (action) {
      case "addItem":
        await this.handleAddItem();
        break;

      case "receiveStock":
        await this.handleReceiveStock();
        break;

      case "viewAll":
        this.handleViewAll();
        break;

      case "lowStock":
        this.handleLowStock();
        break;

      case "goBack":
        return;
    }

    await inquirer.prompt({
      name: "back",
      type: "input",
      message: "Press Enter to return to the Inventory Menu.",
    });

    return this.showInventoryMenu();
  }

  private async handleAddItem(): Promise<void> {
    const { id, name, quantity, reorderLevel } = await inquirer.prompt([
      {
        name: "id",
        type: "input",
        message: "Enter item ID:",
        validate: (value) => value.trim().length > 0 || "ID cannot be empty",
      },
      {
        name: "name",
        type: "input",
        message: "Enter item name:",
        validate: (value) =>
          value.trim().length >= 2 || "Name must be at least 2 characters",
      },
      {
        name: "quantity",
        type: "number",
        message: "Enter starting quantity:",
        validate: (value) =>
          (value !== undefined && value >= 0) || "Must be 0 or more",
      },
      {
        name: "reorderLevel",
        type: "number",
        message: "Enter reorder level (default 10):",
        default: 10,
      },
    ]);

    try {
      const item = new InventoryItem(id, name, quantity, reorderLevel);
      this.inventoryService.addNewItem(item);
      console.log("✅ Inventory item added successfully.");
    } catch (err) {
      console.log("❌ " + (err as Error).message);
    }
  }

  private async handleReceiveStock(): Promise<void> {
    const allItems = this.inventoryService.listAllItems();

    if (allItems.length === 0) {
      console.log("❌ No inventory items found.");
      return;
    }

    const { productId } = await inquirer.prompt({
      name: "productId",
      type: "list",
      message: "Select item to receive stock:",
      choices: allItems.map((item) => ({
        name: `${item.name} (${item.id}) — Qty: ${item.quantity}`,
        value: item.id,
      })),
    });

    const { amount } = await inquirer.prompt({
      name: "amount",
      type: "number",
      message: "Enter quantity to receive:",
      validate: (value) =>
        (value !== undefined && value > 0) || "Must be greater than 0",
    });

    try {
      this.inventoryService.receiveStock(productId, amount);
      console.log("✅ Stock received.");
    } catch (err) {
      console.log("❌ " + (err as Error).message);
    }
  }

  private handleViewAll(): void {
    const all = this.inventoryService.listAllItems();

    if (all.length === 0) {
      console.log("❌ No inventory to display.");
      return;
    }

    console.log("\n📦 Current Inventory:");
    for (const item of all) {
      console.log(item.getItemDetails());
    }
  }

  private handleLowStock(): void {
    const lowItems = this.inventoryService.getLowStockItems();

    if (lowItems.length === 0) {
      console.log("✅ No low stock items.");
      return;
    }

    console.log("\n⚠️ Low Stock Alerts:");
    for (const item of lowItems) {
      console.log(item.getItemDetails());
    }
  }
}
