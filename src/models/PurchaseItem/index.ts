export class PurchaseItem {
  constructor(
    public productId: string,
    public productName: string,
    public unitPrice: number,
    public quantity: number
  ) {
    if (quantity <= 0)
      throw new Error("❌ Quantity must be greater than zero.");

    if (unitPrice < 0) throw new Error("❌ Unit price cannot be negative.");

    if (!productName.trim())
      throw new Error("❌ Product name cannot be empty.");
  }

  public getTotalPrice(): number {
    return this.unitPrice * this.quantity;
  }
}
