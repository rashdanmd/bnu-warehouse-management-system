import { describe, it, expect } from "vitest";
import { Supplier } from "./index";
import { PurchaseOrder } from "../PurchaseOrder";

describe("Supplier", () => {
  it("should create a supplier with valid details", () => {
    const supplier = new Supplier(
      "1",
      "Valid Supplier",
      "supplier@example.com"
    );
    expect(supplier.id).toBe("1");
    expect(supplier.name).toBe("Valid Supplier");
    expect(supplier.contactEmail).toBe("supplier@example.com");
    expect(supplier.purchaseOrders).toEqual([]);
  });

  it("should throw an error for invalid email", () => {
    expect(() => new Supplier("1", "Valid Supplier", "invalid-email")).toThrow(
      "Not a valid email address"
    );
  });

  it("should throw an error for invalid name", () => {
    expect(() => new Supplier("1", "", "supplier@example.com")).toThrow(
      "Not a valid name"
    );
  });

  it("should update contact email with a valid email", () => {
    const supplier = new Supplier(
      "1",
      "Valid Supplier",
      "supplier@example.com"
    );
    supplier.updateContactEmail("newemail@example.com");
    expect(supplier.contactEmail).toBe("newemail@example.com");
  });

  it("should throw an error when updating contact email with an invalid email", () => {
    const supplier = new Supplier(
      "1",
      "Valid Supplier",
      "supplier@example.com"
    );
    expect(() => supplier.updateContactEmail("invalid-email")).toThrow(
      "Not a valid email address"
    );
  });

  it("should add a purchase order", () => {
    const supplier = new Supplier(
      "1",
      "Valid Supplier",
      "supplier@example.com"
    );
    const order = new PurchaseOrder("PO1", new Date(), []);
    supplier.addOrder(order);
    expect(supplier.purchaseOrders).toContain(order);
  });

  it("should return order summaries", () => {
    const supplier = new Supplier(
      "1",
      "Valid Supplier",
      "supplier@example.com"
    );
    const order1 = new PurchaseOrder("PO1", new Date(), []);
    const order2 = new PurchaseOrder("PO2", new Date(), []);
    supplier.addOrder(order1);
    supplier.addOrder(order2);

    const summaries = supplier.getOrderSummaries();
    expect(summaries).toHaveLength(2);
    expect(summaries).toContain(order1.getOrderSummary());
    expect(summaries).toContain(order2.getOrderSummary());
  });

  it("should validate email correctly", () => {
    expect(Supplier.isValidEmail("valid@example.com")).toBe(true);
    expect(Supplier.isValidEmail("invalid-email")).toBe(false);
  });

  it("should validate name correctly", () => {
    expect(Supplier.isValidName("Valid Name")).toBe(true);
    expect(Supplier.isValidName("")).toBe(false);
    expect(Supplier.isValidName("A")).toBe(false);
  });

  it("should return supplier details", () => {
    const supplier = new Supplier(
      "1",
      "Valid Supplier",
      "supplier@example.com"
    );
    const details = supplier.getSupplierDetails();
    expect(details).toBe(
      "Supplier ID: 1, Name: Valid Supplier, Contact: supplier@example.com"
    );
  });
});
