import inquirer from "inquirer";

import { SupplierService } from "@services/SupplierService";
import { Supplier } from "../../models/Supplier";

export class SupplierHandler {
  constructor(private supplierService: SupplierService) {}

  public async showSupplierMenu(): Promise<void> {
    const choices = [
      "View all suppliers",
      "Add a new supplier",
      "Edit supplier details",
      "Remove supplier",
      "Back to main menu",
    ];

    const { action } = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "Supplier Management Menu",
      choices,
    });

    switch (action) {
      case "View all suppliers":
        const supplierList = this.supplierService.getAllSuppliers();
        if (supplierList.length === 0) {
          console.log("No suppliers found.");
        } else {
          supplierList.forEach((supplier) =>
            console.log("🔘", supplier.getSupplierDetails())
          );
        }
        break;

      case "Add a new supplier":
        const { name, email } = await inquirer.prompt([
          {
            name: "name",
            type: "input",
            message: "Enter supplier name:",
            validate: (input) => {
              return Supplier.isValidName(input)
                ? true
                : "Enter a valid name between 2 and 50 characters).";
            },
          },
          {
            name: "email",
            type: "input",
            message: "Enter supplier email:",
            validate: (input) => {
              return Supplier.isValidEmail(input)
                ? true
                : "Enter a valid email address.";
            },
          },
        ]);

        const newSupplier = new Supplier(
          `SUP-ID${Date.now()}`,
          name.trim(),
          email.trim()
        );
        this.supplierService.addSupplier(newSupplier);

        console.log(`✅ Supplier "${name}" added successfully.`);
        break;

      case "Remove supplier":
        const allSuppliers = this.supplierService.getAllSuppliers();

        if (allSuppliers.length === 0) {
          console.log("There are currently no suppliers to remove.");
          break;
        }

        const { supplierIdToRemove } = await inquirer.prompt({
          name: "supplierIdToRemove",
          type: "list",
          message: "Select the supplier you wish to remove:",
          choices: allSuppliers.map((supplier) => ({
            name: `${supplier.name} (${supplier.id})`,
            value: supplier.id,
          })),
        });

        const success = this.supplierService.removeSupplier(supplierIdToRemove);

        const removedSupplier = allSuppliers.find(
          (supplier) => supplier.id === supplierIdToRemove
        );
        if (success && removedSupplier) {
          console.log(
            `✅ The following supplier: ${removedSupplier.name}, has been sucessfully removed.`
          );
        } else {
          console.log("❌ Failed to remove supplier.");
        }

        break;

      case "Back to main menu":
        return;
    }

    await inquirer.prompt({
      name: "back",
      type: "input",
      message: "Press Enter to return to the Supplier Menu",
    });

    return this.showSupplierMenu();
  }
}
