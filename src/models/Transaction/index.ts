export type TransactionType = "SupplierPayment" | "CustomerPayment";

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly date: Date,
    public readonly description: string
  ) {}

  public getSummary(): string {
    return `[${this.type}] £${this.amount.toFixed(2)} — ${this.description} (${this.date.toLocaleDateString()})`;
  }
}
