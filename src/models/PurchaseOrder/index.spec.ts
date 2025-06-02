import { describe, it, expect } from "vitest";

import { PurchaseOrder, OrderStatus } from "./index";
import { PurchaseItem } from "../PurchaseItem";

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

  it("should return the correct order summary", () => {
    const items = [
      new PurchaseItem("ID-1", "item1", 2, 10),
      new PurchaseItem("ID-2", "item2", 3, 15),
    ];
    const order = new PurchaseOrder("order1", "supplier1", items);

    const expectedSummary = `Order ID: order1\nSupplier: supplier1\nStatus: Pending\nTotal: £65.00`;
    expect(order.getOrderSummary()).toBe(expectedSummary);
  });

  it("should default to 'Pending' status and current date if not provided", () => {
    const items = [new PurchaseItem("ID-4", "item1", 1, 10)];
    const order = new PurchaseOrder("order1", "supplier1", items);

    expect(order.status).toBe("Pending");
    expect(order.orderDate).toBeInstanceOf(Date);
  });
});
