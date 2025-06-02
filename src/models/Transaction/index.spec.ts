import { describe, it, expect } from "vitest";
import { Transaction } from "./index";

describe("Transaction", () => {
  it("should create a Transaction instance with correct properties", () => {
    const transaction = new Transaction(
      "txn123",
      "CustomerPayment",
      150.75,
      new Date("2023-10-01"),
      "Payment for order #123"
    );

    expect(transaction.id).toBe("txn123");
    expect(transaction.type).toBe("CustomerPayment");
    expect(transaction.amount).toBe(150.75);
    expect(transaction.date.toISOString()).toBe(
      new Date("2023-10-01").toISOString()
    );
    expect(transaction.description).toBe("Payment for order #123");
  });

  it("should return a correct summary string", () => {
    const transaction = new Transaction(
      "txn456",
      "SupplierPayment",
      300.5,
      new Date("2023-10-02"),
      "Payment to supplier ABC"
    );

    const summary = transaction.getSummary();
    expect(summary).toContain(
      "[SupplierPayment] £300.50 — Payment to supplier ABC"
    );
    expect(summary).toMatch(/\(02\/10\/2023\)/); // DD/MM/YYYY
  });

  it("should handle zero amount correctly", () => {
    const transaction = new Transaction(
      "txn789",
      "CustomerPayment",
      0,
      new Date("2023-10-03"),
      "Refund for order #456"
    );

    const summary = transaction.getSummary();
    expect(summary).toContain(
      "[CustomerPayment] £0.00 — Refund for order #456"
    );
    expect(summary).toMatch(/\(03\/10\/2023\)/);
  });

  it("should handle negative amounts correctly", () => {
    const transaction = new Transaction(
      "txn101",
      "SupplierPayment",
      -50.25,
      new Date("2023-10-04"),
      "Adjustment for overpayment"
    );

    const summary = transaction.getSummary();
    expect(summary).toContain(
      "[SupplierPayment] £-50.25 — Adjustment for overpayment"
    );
    expect(summary).toMatch(/\(04\/10\/2023\)/);
  });

  it("should handle different transaction types", () => {
    const customerTransaction = new Transaction(
      "txn111",
      "CustomerPayment",
      200,
      new Date("2023-10-05"),
      "Payment for order #789"
    );

    const supplierTransaction = new Transaction(
      "txn112",
      "SupplierPayment",
      500,
      new Date("2023-10-06"),
      "Payment to supplier XYZ"
    );

    expect(customerTransaction.type).toBe("CustomerPayment");
    expect(supplierTransaction.type).toBe("SupplierPayment");
  });
});
