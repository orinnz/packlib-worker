// D1Database type is globally available from worker-configuration.d.ts

export interface Customer {
  CustomerId: number
  CompanyName: string
  ContactName: string
}

export interface CreateCustomerInput {
  companyName: string
  contactName: string
}

export class CustomerDatastore {
  constructor(private db: D1Database) {}

  async getAll(): Promise<Customer[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM Customers')
      .all<Customer>()
    return results
  }

  async getById(id: number): Promise<Customer | null> {
    const customer = await this.db
      .prepare('SELECT * FROM Customers WHERE CustomerId = ?')
      .bind(id)
      .first<Customer>()
    return customer
  }

  async create(input: CreateCustomerInput): Promise<void> {
    await this.db
      .prepare('INSERT INTO Customers (CompanyName, ContactName) VALUES (?, ?)')
      .bind(input.companyName, input.contactName)
      .run()
  }

  async getCount(): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as total FROM Customers')
      .first<{ total: number }>()
    return result?.total ?? 0
  }
}
