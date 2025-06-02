import { describe, it, expect } from "vitest";

import { PurchaseItem } from "./index";
import { PurchaseOrder } from "../PurchaseOrder";
import { InventoryItem } from "../InventoryItem";

describe("PurchaseItem", () => {
  it("should calculate total price correctly", () => {
    const purchaseItem = new PurchaseItem("ID-2", "Test Product", 10, 5);
    expect(purchaseItem.getTotalPrice()).toBe(50);
  });

  it("should throw an error when quanity is zero", () => {
    expect(() => new PurchaseItem("ID-3", "zero-product", 100, 0)).toThrow(
      "❌ Quantity must be greater than zero."
    );
  });

  it("should throw an error for negative quantity", () => {
    expect(
      () => new PurchaseItem("ID-99", "negative-quantity-product", 100, -6)
    ).toThrow("❌ Quantity must be greater than zero.");
  });

  it("should throw an error for negative unit price", () => {
    expect(
      () => new PurchaseItem("ID-8", "negative-price-product", -50, 8)
    ).toThrow("❌ Unit price cannot be negative.");
  });

  it("should throw an error if product name is empty", () => {
    expect(() => new PurchaseItem("ID-9", "", 10, 1)).toThrow(
      "❌ Product name cannot be empty."
    );
  });

  it("should throw an error for product name with only spaces", () => {
    expect(() => new PurchaseItem("ID-190", "   ", 10, 1)).toThrow(
      "❌ Product name cannot be empty."
    );
  });
});
describe("PurchaseOrder", () => {
  it("should calculate total order cost correctly", () => {
    const items = [
      new PurchaseItem("ID-1", "Product A", 20, 2),
      new PurchaseItem("ID-2", "Product B", 15, 3),
    ];
    const purchaseOrder = new PurchaseOrder("PO-1", "SUP-1", items);
    expect(purchaseOrder.getCostOfTotalOrder()).toBe(85);
  });

  it("should update status and timestamps correctly", () => {
    const items = [new PurchaseItem("ID-1", "Product A", 20, 2)];
    const purchaseOrder = new PurchaseOrder("PO-2", "SUP-2", items);

    purchaseOrder.updateStatus("Shipped");
    expect(purchaseOrder.status).toBe("Shipped");
    expect(purchaseOrder.shippedAt).not.toBeNull();

    purchaseOrder.updateStatus("Delivered");
    expect(purchaseOrder.status).toBe("Delivered");
    expect(purchaseOrder.deliveredAt).not.toBeNull();
  });

  it("should throw an error if inventory is updated before delivery", () => {
    const items = [new PurchaseItem("ID-1", "Product A", 20, 2)];
    const purchaseOrder = new PurchaseOrder("PO-3", "SUP-3", items);
    const inventoryMap = new Map();

    expect(() => purchaseOrder.applyToInventory(inventoryMap)).toThrow(
      "Order must be delivered before updating inventory"
    );
  });

  it("should throw an error if inventory is updated twice", () => {
    const items = [new PurchaseItem("ID-1", "Product A", 20, 2)];
    const purchaseOrder = new PurchaseOrder("PO-4", "SUP-4", items);
    const inventoryItem = new InventoryItem("ID-1", "Product A", 50);
    const inventoryMap = new Map([["ID-1", inventoryItem]]);

    purchaseOrder.updateStatus("Delivered");
    purchaseOrder.applyToInventory(inventoryMap);

    expect(() => purchaseOrder.applyToInventory(inventoryMap)).toThrow(
      "Inventory already updated for this order"
    );
  });

  it("should update inventory correctly", () => {
    const items = [new PurchaseItem("ID-1", "Product A", 20, 2)];
    const purchaseOrder = new PurchaseOrder("PO-5", "SUP-5", items);
    const inventoryItem = new InventoryItem("ID-1", "Product A", 50);
    const inventoryMap = new Map([["ID-1", inventoryItem]]);

    purchaseOrder.updateStatus("Delivered");
    purchaseOrder.applyToInventory(inventoryMap);

    expect(inventoryItem.quantity).toBe(52);
  });

  it("should throw an error if inventory item is missing", () => {
    const items = [new PurchaseItem("ID-1", "Product A", 20, 2)];
    const purchaseOrder = new PurchaseOrder("PO-6", "SUP-6", items);
    const inventoryMap = new Map();

    purchaseOrder.updateStatus("Delivered");

    expect(() => purchaseOrder.applyToInventory(inventoryMap)).toThrow(
      "No inventory item found for product ID: ID-1"
    );
  });

  it("should generate order summary correctly", () => {
    const items = [
      new PurchaseItem("ID-1", "Product A", 20, 2),
      new PurchaseItem("ID-2", "Product B", 15, 3),
    ];
    const purchaseOrder = new PurchaseOrder("PO-7", "SUP-7", items);

    const summary = purchaseOrder.getOrderSummary();
    expect(summary).toContain("Order ID    : PO-7");
    expect(summary).toContain("Supplier ID : SUP-7");
    expect(summary).toContain("Status      : Pending");
    expect(summary).toContain("Product A");
    expect(summary).toContain("Product B");
    expect(summary).toContain("💰 Total Cost: £85.00");
  });
});
