import inquirer from "inquirer";

import {
  SupplierHandler,
  PurchaseOrderHandler,
  InventoryHandler,
  CustomerOrderHandler,
  ExitHandler,
  FinanceHandler,
} from "./handlers";
import {
  SupplierService,
  PurchaseOrderService,
  InventoryService,
  CustomerOrderService,
  FinanceService,
} from "./services";
import { b } from "vitest/dist/chunks/suite.d.FvehnV49";

const supplierService = new SupplierService();
const purchaseOrderService = new PurchaseOrderService();
const inventoryService = new InventoryService();
const customerOrderService = new CustomerOrderService(inventoryService);
const financeService = new FinanceService();

const supplierHandler = new SupplierHandler(supplierService);
const inventoryHandler = new InventoryHandler(inventoryService);
const financeHandler = new FinanceHandler(financeService);
const purchaseHandler = new PurchaseOrderHandler(
  purchaseOrderService,
  supplierService,
  inventoryService
);
const customerOrderHandler = new CustomerOrderHandler(
  customerOrderService,
  inventoryService
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
      { name: "📊 Manage Inventory", value: "manageInventory" },
      { name: "🧾 Manage Customer Orders", value: "manageCustomerOrders" },
      { name: "💰 Finance", value: "finance" },
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

    case "manageInventory":
      await inventoryHandler.showInventoryMenu();
      return App();

    case "manageCustomerOrders":
      await customerOrderHandler.showCustomerOrderMenu();
      return App();

    case "exit":
      const confirmed = await exitHandler.confirmExit();
      if (!confirmed) return App();
      break;

    case "finance":
      await financeHandler.showFinanceMenu();
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
