import inquirer from "inquirer";

import { SupplierHandler, ExitHandler } from "./handlers";
import { SupplierService } from "./services/SupplierService";

const supplierService = new SupplierService();

const App = async () => {
  const welcomeMessage =
    "👋 Welcome to BNU Industry Solutions Ltd. Warehouse Management System\n\nPlease choose from the following options";

  const choices = ["Manage Suppliers", "Exit"];

  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: welcomeMessage,
    choices: choices,
  });

  switch (action) {
    case "Manage Suppliers":
      await new SupplierHandler(supplierService).showSupplierMenu();
      return App();

    case "Exit":
      const exitConfirmed = await new ExitHandler().confirmExit();
      if (!exitConfirmed) return App();
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
