import inquirer from "inquirer";
import { FinanceService } from "../../services/";

export class FinanceHandler {
  constructor(private financeService: FinanceService) {}

  public async showFinanceMenu(): Promise<void> {
    const choices = [
      { name: "📄 View All Transactions", value: "viewAll" },
      { name: "📊 View Financial Summary", value: "summary" },
      { name: "🔙 Go Back", value: "goBack" },
    ];

    const { action } = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "💰 Finance Menu",
      choices,
    });

    switch (action) {
      case "viewAll":
        this.handleViewAll();
        break;
      case "summary":
        this.handleSummary();
        break;
      case "goBack":
        return;
    }

    await inquirer.prompt({
      name: "back",
      type: "input",
      message: "Press Enter to return to the Finance Menu.",
    });

    return this.showFinanceMenu();
  }

  private handleViewAll(): void {
    const transactions = this.financeService.getAllTransactions();
    if (transactions.length === 0) {
      console.log("❌ No transactions recorded.");
      return;
    }

    console.log("\n📄 All Transactions:");
    for (const transaction of transactions) {
      console.log("—", transaction.getSummary());
    }
  }

  private handleSummary(): void {
    const summary = this.financeService.getSummary();
    console.log("\n📊 Financial Summary:");
    console.log(
      `💰 Customer Payments : £${summary.totalCustomerPayments.toFixed(2)}`
    );
    console.log(
      `💸 Supplier Payments : £${summary.totalSupplierPayments.toFixed(2)}`
    );
    console.log(`📈 Net Profit        : £${summary.netProfit.toFixed(2)}`);
  }
}
