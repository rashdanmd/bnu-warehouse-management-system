import { Supplier } from "@models/Supplier";

export class SupplierService {
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

  public updateSupplier(id: string, updatedSupplier: Supplier): void {
    const index = this.suppliers.findIndex((supplier) => supplier.id === id);
    if (index !== -1) {
      this.suppliers[index] = updatedSupplier;
    }
  }

  public removeSupplier(id: string): boolean {
    const originalLength = this.suppliers.length;
    this.suppliers = this.suppliers.filter((supplier) => supplier.id !== id);
    return this.suppliers.length < originalLength;
  }
}
