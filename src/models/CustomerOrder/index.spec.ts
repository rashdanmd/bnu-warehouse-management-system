import { describe, it, expect, vi } from "vitest";

import { CustomerOrder } from "./index";
import { InventoryItem } from "../InventoryItem";

describe("CustomerOrder", () => {
  it("should calculate the total cost of the order", () => {
    const order = new CustomerOrder("1", "John Doe", [
      { productId: "p1", productName: "Product 1", quantity: 2, unitPrice: 10 },
      { productId: "p2", productName: "Product 2", quantity: 1, unitPrice: 20 },
    ]);

    expect(order.getTotalCost()).toBe(40);
  });

  it("should fulfill the order and update status and fulfilledAt", () => {
    const inventory = new Map([
      ["p1", { productId: "p1", quantity: 5, decreaseStock: vi.fn() }],
      ["p2", { productId: "p2", quantity: 3, decreaseStock: vi.fn() }],
    ]);

    const order = new CustomerOrder("1", "John Doe", [
      { productId: "p1", productName: "Product 1", quantity: 2, unitPrice: 10 },
      { productId: "p2", productName: "Product 2", quantity: 1, unitPrice: 20 },
    ]);

    order.fulfillOrder(inventory);

    expect(order.status).toBe("Fulfilled");
    expect(order.fulfilledAt).toBeInstanceOf(Date);
    expect(inventory.get("p1")?.decreaseStock).toHaveBeenCalledWith(2);
    expect(inventory.get("p2")?.decreaseStock).toHaveBeenCalledWith(1);
  });

  it("should throw an error if the order is already fulfilled", () => {
    const inventory = new Map([
      ["p1", { productId: "p1", quantity: 5, decreaseStock: vi.fn() }],
    ]);

    const order = new CustomerOrder("1", "John Doe", [
      { productId: "p1", productName: "Product 1", quantity: 2, unitPrice: 10 },
    ]);

    order.fulfillOrder(inventory);

    expect(() => order.fulfillOrder(inventory)).toThrow(
      "Order already fulfilled."
    );
  });

  it("should throw an error if an inventory item is not found", () => {
    const inventory = new Map();

    const order = new CustomerOrder("1", "John Doe", [
      { productId: "p1", productName: "Product 1", quantity: 2, unitPrice: 10 },
    ]);

    expect(() => order.fulfillOrder(inventory)).toThrow(
      "Inventory item not found for p1"
    );
  });

  it("should throw an error if there is not enough stock", () => {
    const inventory = new Map([
      ["p1", { productId: "p1", quantity: 1, decreaseStock: vi.fn() }],
    ]);

    const order = new CustomerOrder("1", "John Doe", [
      { productId: "p1", productName: "Product 1", quantity: 2, unitPrice: 10 },
    ]);

    expect(() => order.fulfillOrder(inventory)).toThrow(
      "Not enough stock for Product 1"
    );
  });

  it("should generate a correct order summary", () => {
    const order = new CustomerOrder("1", "John Doe", [
      { productId: "p1", productName: "Product 1", quantity: 2, unitPrice: 10 },
      { productId: "p2", productName: "Product 2", quantity: 1, unitPrice: 20 },
    ]);

    const summary = order.getOrderSummary();

    expect(summary).toContain("Customer Order ID: 1");
    expect(summary).toContain("Customer: John Doe");
    expect(summary).toContain("Status: Pending");
    expect(summary).toContain("Product 1 (p1) x2 @ £10.00");
    expect(summary).toContain("Product 2 (p2) x1 @ £20.00");
    expect(summary).toContain("💰 Total: £40.00");
  });
});
describe("InventoryItem", () => {
  it("should initialize with valid properties", () => {
    const item = new InventoryItem("item1", "Test Product", 20, 5);

    expect(item.id).toBe("item1");
    expect(item.name).toBe("Test Product");
    expect(item.quantity).toBe(20);
    expect(item.reorderLevel).toBe(5);
  });

  it("should throw an error if quantity is negative", () => {
    expect(() => new InventoryItem("item1", "Test Product", -5)).toThrow(
      "Quantity cannot be negative"
    );
  });

  it("should throw an error if name is invalid", () => {
    expect(() => new InventoryItem("item1", "", 10)).toThrow(
      "Invalid product name"
    );
    expect(() => new InventoryItem("item1", "A", 10)).toThrow(
      "Invalid product name"
    );
  });

  it("should increase stock correctly", () => {
    const item = new InventoryItem("item1", "Test Product", 10);
    item.increaseStock(5);

    expect(item.quantity).toBe(15);
  });

  it("should throw an error when increasing stock with non-positive amount", () => {
    const item = new InventoryItem("item1", "Test Product", 10);

    expect(() => item.increaseStock(0)).toThrow(
      "Amount must be greater than 0"
    );
    expect(() => item.increaseStock(-5)).toThrow(
      "Amount must be greater than 0"
    );
  });

  it("should decrease stock correctly", () => {
    const item = new InventoryItem("item1", "Test Product", 10);
    item.decreaseStock(5);

    expect(item.quantity).toBe(5);
  });

  it("should throw an error when decreasing stock with non-positive amount", () => {
    const item = new InventoryItem("item1", "Test Product", 10);

    expect(() => item.decreaseStock(0)).toThrow(
      "Amount must be greater than 0"
    );
    expect(() => item.decreaseStock(-5)).toThrow(
      "Amount must be greater than 0"
    );
  });

  it("should throw an error when decreasing stock with amount greater than available quantity", () => {
    const item = new InventoryItem("item1", "Test Product", 10);

    expect(() => item.decreaseStock(15)).toThrow("Not enough stock available");
  });

  it("should correctly identify low stock", () => {
    const item = new InventoryItem("item1", "Test Product", 5, 10);

    expect(item.isLowStock()).toBe(true);

    item.increaseStock(10);
    expect(item.isLowStock()).toBe(false);
  });

  it("should generate correct item details", () => {
    const item = new InventoryItem("item1", "Test Product", 5, 10);

    const details = item.getItemDetails();
    expect(details).toContain("Item ID: item1");
    expect(details).toContain("Name: Test Product");
    expect(details).toContain("Quantity: 5");
    expect(details).toContain("Low Stock: true");
  });

  it("should validate product names correctly", () => {
    expect(InventoryItem.isValidName("Valid Name")).toBe(true);
    expect(InventoryItem.isValidName("A")).toBe(false);
    expect(InventoryItem.isValidName("")).toBe(false);
    expect(InventoryItem.isValidName("Invalid@Name")).toBe(false);
  });
});
