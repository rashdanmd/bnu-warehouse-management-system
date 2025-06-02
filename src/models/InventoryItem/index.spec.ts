import { describe, it, expect } from "vitest";
import { InventoryItem } from "./index";

describe("InventoryItem", () => {
  it("should create an InventoryItem with valid properties", () => {
    const item = new InventoryItem("1", "Widget", 20, 5);
    expect(item.id).toBe("1");
    expect(item.name).toBe("Widget");
    expect(item.quantity).toBe(20);
    expect(item.reorderLevel).toBe(5);
  });

  it("should throw an error for negative quantity", () => {
    expect(() => new InventoryItem("2", "Gadget", -5)).toThrow(
      "Quantity cannot be negative"
    );
  });

  it("should throw an error for invalid product name", () => {
    expect(() => new InventoryItem("3", "", 10)).toThrow(
      "Invalid product name"
    );
  });

  it("should increase stock correctly", () => {
    const item = new InventoryItem("4", "Widget", 10);
    item.increaseStock(5);
    expect(item.quantity).toBe(15);
  });

  it("should throw an error when increasing stock with non-positive amount", () => {
    const item = new InventoryItem("5", "Widget", 10);
    expect(() => item.increaseStock(0)).toThrow(
      "Amount must be greater than 0"
    );
  });

  it("should decrease stock correctly", () => {
    const item = new InventoryItem("6", "Widget", 10);
    item.decreaseStock(5);
    expect(item.quantity).toBe(5);
  });

  it("should throw an error when decreasing stock with non-positive amount", () => {
    const item = new InventoryItem("7", "Widget", 10);
    expect(() => item.decreaseStock(0)).toThrow(
      "Amount must be greater than 0"
    );
  });

  it("should throw an error when decreasing stock more than available", () => {
    const item = new InventoryItem("8", "Widget", 10);
    expect(() => item.decreaseStock(15)).toThrow("Not enough stock available");
  });

  it("should correctly identify low stock", () => {
    const item = new InventoryItem("9", "Widget", 5, 10);
    expect(item.isLowStock()).toBe(true);
  });

  it("should correctly identify sufficient stock", () => {
    const item = new InventoryItem("10", "Widget", 15, 10);
    expect(item.isLowStock()).toBe(false);
  });

  it("should return correct item details", () => {
    const item = new InventoryItem("11", "Widget", 20, 10);
    const details = item.getItemDetails();
    expect(details).toBe(
      "Item ID: 11, Name: Widget, Quantity: 20, Low Stock: false"
    );
  });
});
