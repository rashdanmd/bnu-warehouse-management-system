import { describe, it, expect } from "vitest";

import { PurchaseOrder } from "./index";
import { PurchaseItem } from "../PurchaseItem";
import { Supplier } from "../Supplier";

describe("PurchaseOrder", () => {
  it("should calculate the total cost of the order", () => {
    const items = [
      new PurchaseItem("ID-1", "item1", 2, 10),
      new PurchaseItem("ID-2", "item2", 3, 15),
    ];
    const order = new PurchaseOrder("order1", "supplier1", items);

    expect(order.getCostOfTotalOrder()).toBe(65);
  });

  it("should update the order status", () => {
    const items = [new PurchaseItem("ID-3", "item1", 1, 10)];
    const order = new PurchaseOrder("order1", "supplier1", items);

    order.updateStatus("Shipped");
    expect(order.status).toBe("Shipped");

    order.updateStatus("Delivered");
    expect(order.status).toBe("Delivered");
  });

  it("should default to 'Pending' status and current date if not provided", () => {
    const items = [new PurchaseItem("ID-4", "item1", 1, 10)];
    const order = new PurchaseOrder("order1", "supplier1", items);

    expect(order.status).toBe("Pending");
    expect(order.orderDate).toBeInstanceOf(Date);
  });
});
describe("Supplier", () => {
  it("should create a supplier with valid details", () => {
    const supplier = new Supplier(
      "supplier1",
      "Supplier Name",
      "supplier@example.com"
    );

    expect(supplier.id).toBe("supplier1");
    expect(supplier.name).toBe("Supplier Name");
    expect(supplier.contactEmail).toBe("supplier@example.com");
    expect(supplier.purchaseOrders).toEqual([]);
  });

  it("should throw an error for invalid email", () => {
    expect(
      () => new Supplier("supplier1", "Supplier Name", "invalid-email")
    ).toThrow("Not a valid email address");
  });

  it("should throw an error for invalid name", () => {
    expect(() => new Supplier("supplier1", "", "supplier@example.com")).toThrow(
      "Not a valid name"
    );
  });

  it("should update the contact email", () => {
    const supplier = new Supplier(
      "supplier1",
      "Supplier Name",
      "supplier@example.com"
    );

    supplier.updateContactEmail("newemail@example.com");
    expect(supplier.contactEmail).toBe("newemail@example.com");
  });

  it("should throw an error when updating to an invalid email", () => {
    const supplier = new Supplier(
      "supplier1",
      "Supplier Name",
      "supplier@example.com"
    );

    expect(() => supplier.updateContactEmail("invalid-email")).toThrow(
      "Not a valid email address"
    );
  });

  it("should add a purchase order to the supplier", () => {
    const supplier = new Supplier(
      "supplier1",
      "Supplier Name",
      "supplier@example.com"
    );
    const items = [new PurchaseItem("ID-1", "item1", 2, 10)];
    const order = new PurchaseOrder("order1", "supplier1", items);

    supplier.addOrder(order);
    expect(supplier.purchaseOrders).toContain(order);
  });

  it("should return order summaries for the supplier", () => {
    const supplier = new Supplier(
      "supplier1",
      "Supplier Name",
      "supplier@example.com"
    );
    const items1 = [new PurchaseItem("ID-1", "item1", 2, 10)];
    const items2 = [new PurchaseItem("ID-2", "item2", 3, 15)];
    const order1 = new PurchaseOrder("order1", "supplier1", items1);
    const order2 = new PurchaseOrder("order2", "supplier1", items2);

    supplier.addOrder(order1);
    supplier.addOrder(order2);

    const summaries = supplier.getOrderSummaries();
    expect(summaries).toEqual([
      order1.getOrderSummary(),
      order2.getOrderSummary(),
    ]);
  });
});
