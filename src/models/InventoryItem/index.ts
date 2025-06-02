export class InventoryItem {
  constructor(
    public readonly id: string,
    public name: string,
    public quantity: number,
    public reorderLevel: number = 10 // Alert when stock is below this
  ) {
    if (quantity < 0) throw new Error("Quantity cannot be negative");
    if (!InventoryItem.isValidName(name))
      throw new Error("Invalid product name");
  }

  public increaseStock(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    this.quantity += amount;
  }

  public decreaseStock(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    if (amount > this.quantity) throw new Error("Not enough stock available");
    this.quantity -= amount;
  }

  public isLowStock(): boolean {
    return this.quantity <= this.reorderLevel;
  }

  public getItemDetails(): string {
    return `Item ID: ${this.id}, Name: ${this.name}, Quantity: ${this.quantity}, Low Stock: ${this.isLowStock()}`;
  }

  public static isValidName(name: string): boolean {
    const validName = /^[a-zA-Z0-9\s&.,'()\-]{2,50}$/.test(name.trim());
    return validName;
  }
}
