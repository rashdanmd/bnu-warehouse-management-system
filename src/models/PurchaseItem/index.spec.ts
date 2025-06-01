import { PurchaseItem } from "./index";
import { describe, it, expect } from "vitest";

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
