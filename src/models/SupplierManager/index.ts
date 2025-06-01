import { Supplier } from "../Supplier";

export class SupplierManager {
  private suppliers: Supplier[] = [];

  public addSupplier(supplier: Supplier): void {
    this.suppliers.push(supplier);
  }

  public getSupplierById(id: string): Supplier | undefined {
    return this.suppliers.find((supplier) => supplier.id === id);
  }

  public getAllSuppliers(): Supplier[] {
    return [...this.suppliers];
  }
}
