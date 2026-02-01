import type { Customer, CreateCustomerInput } from '../models/customer'
import { 
  findAllCustomers,
  findCustomerById,
  insertCustomer,
  countCustomers
} from '../datastore/customers'

export async function getAllCustomers(db: D1Database): Promise<Customer[]> {
  return findAllCustomers(db)
}

export async function getCustomerById(db: D1Database, id: number): Promise<Customer | null> {
  return findCustomerById(db, id)
}

export async function createCustomer(db: D1Database, input: CreateCustomerInput): Promise<void> {
  if (!input.companyName || !input.contactName) {
    throw new Error('companyName and contactName are required')
  }
  await insertCustomer(db, input)
}

export async function getCustomerStats(db: D1Database): Promise<{ totalCustomers: number }> {
  const total = await countCustomers(db)
  return { totalCustomers: total }
}
