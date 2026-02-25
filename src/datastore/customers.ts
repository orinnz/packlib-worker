// D1Database type is globally available from worker-configuration.d.ts
import type { CreateCustomerInput, Customer } from "../models/customer";

export async function findAllCustomers(db: D1Database): Promise<Customer[]> {
  const { results } = await db.prepare("SELECT * FROM Customers").all<Customer>();
  return results;
}

export async function findCustomerById(db: D1Database, id: number): Promise<Customer | null> {
  const customer = await db.prepare("SELECT * FROM Customers WHERE CustomerId = ?").bind(id).first<Customer>();
  return customer;
}

export async function insertCustomer(db: D1Database, input: CreateCustomerInput): Promise<void> {
  await db
    .prepare("INSERT INTO Customers (CompanyName, ContactName) VALUES (?, ?)")
    .bind(input.companyName, input.contactName)
    .run();
}

export async function countCustomers(db: D1Database): Promise<number> {
  const result = await db.prepare("SELECT COUNT(*) as total FROM Customers").first<{ total: number }>();
  return result?.total ?? 0;
}
