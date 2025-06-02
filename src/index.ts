import inquirer from "inquirer";

import { SupplierHandler, PurchaseOrderHandler, ExitHandler } from "./handlers";
import { SupplierService, PurchaseOrderService } from "./services";

const supplierService = new SupplierService();
const purchaseOrderService = new PurchaseOrderService();
const supplierHandler = new SupplierHandler(supplierService);
const purchaseHandler = new PurchaseOrderHandler(
  purchaseOrderService,
  supplierService
);
const exitHandler = new ExitHandler();

const App = async () => {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message:
      "👋 Welcome to BNU Industry Solutions Ltd. Warehouse Management System\n\nPlease choose from the following options",
    choices: [
      { name: "🚚 Manage Suppliers", value: "manageSuppliers" },
      { name: "💳 Manage Purchase Orders", value: "managePurchaseOrders" },
      { name: "🚪 Exit", value: "exit" },
    ],
  });

  switch (action) {
    case "manageSuppliers":
      await supplierHandler.showSupplierMenu();
      return App();

    case "managePurchaseOrders":
      await purchaseHandler.showPurchaseOrderMenu();
      return App();

    case "exit":
      const confirmed = await exitHandler.confirmExit();
      if (!confirmed) return App();
      break;

    default:
      await inquirer.prompt({
        name: "acknowledge",
        type: "input",
        message: `You selected: ${action}\n\nPress Enter to return to the main menu.`,
      });

      return App();
  }
};

App();

console.log("Supplier Management System App is running");
