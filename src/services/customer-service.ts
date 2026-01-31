import type { CustomerDatastore, CreateCustomerInput, Customer } from '../datastore/customers'

export class CustomerService {
  constructor(private datastore: CustomerDatastore) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.datastore.getAll()
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    return this.datastore.getById(id)
  }

  async createCustomer(input: CreateCustomerInput): Promise<void> {
    if (!input.companyName || !input.contactName) {
      throw new Error('companyName and contactName are required')
    }
    await this.datastore.create(input)
  }

  async getCustomerStats(): Promise<{ totalCustomers: number }> {
    const total = await this.datastore.getCount()
    return { totalCustomers: total }
  }
}
