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
  const welcomeMessage =
    "👋 Welcome to BNU Industry Solutions Ltd. Warehouse Management System\n\nPlease choose from the following options";

  const choices = [
    "👨‍💼 Manage Suppliers",
    "📦 Manage Purchase Orders",
    "🚪 Exit",
  ];

  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: welcomeMessage,
    choices: choices,
  });

  switch (action) {
    case "👨‍💼 Manage Suppliers":
      await new SupplierHandler(supplierService).showSupplierMenu();
      return App();

    case "📦 Manage Purchase Orders":
      await new PurchaseOrderHandler(
        purchaseOrderService,
        supplierService
      ).showPurchaseOrderMenu();
      return App();

    case "🚪 Exit":
      await exitHandler.confirmExit();
      if (!exitHandler.confirmExit()) return App();
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
