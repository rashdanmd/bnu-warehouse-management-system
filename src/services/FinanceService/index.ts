import { Transaction, TransactionType } from "../../models";

export class FinanceService {
  private transactions: Transaction[] = [];

  public logTransaction(
    type: TransactionType,
    amount: number,
    description: string
  ): void {
    const id = `TRANS-${Date.now()}`;
    const transaction = new Transaction(
      id,
      type,
      amount,
      new Date(),
      description
    );
    this.transactions.push(transaction);
  }

  public getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  public getSummary(): {
    totalCustomerPayments: number;
    totalSupplierPayments: number;
    netProfit: number;
  } {
    const totalCustomerPayments = this.transactions
      .filter((transaction) => transaction.type === "CustomerPayment")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalSupplierPayments = this.transactions
      .filter((transaction) => transaction.type === "SupplierPayment")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const netProfit = totalCustomerPayments - totalSupplierPayments;

    return {
      totalCustomerPayments,
      totalSupplierPayments,
      netProfit,
    };
  }
}
