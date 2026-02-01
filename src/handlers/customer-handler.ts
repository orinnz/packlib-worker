import type { Context } from 'hono'
import { 
  getAllCustomers,
  getCustomerById,
  createCustomer as createCustomerService,
  getCustomerStats
} from '../services/customer-service'

export async function listCustomers(c: Context, db: D1Database) {
  try {
    const customers = await getAllCustomers(db)
    return c.json({ customers })
  } catch (error) {
    return c.json({ error: 'Failed to fetch customers' }, 500)
  }
}

export async function getCustomer(c: Context, db: D1Database) {
  const customerId = Number(c.req.param('id'))

  try {
    const customer = await getCustomerById(db, customerId)

    if (!customer) {
      return c.json({ error: 'Customer not found' }, 404)
    }

    return c.json({ customer })
  } catch (error) {
    return c.json({ error: 'Failed to fetch customer' }, 500)
  }
}

export async function createCustomer(c: Context, db: D1Database) {
  try {
    const body = await c.req.json<{ companyName: string; contactName: string }>()

    await createCustomerService(db, {
      companyName: body.companyName,
      contactName: body.contactName,
    })

    return c.json({
      success: true,
      message: 'Customer created',
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('required')) {
      return c.json({ error: error.message }, 400)
    }
    return c.json({ error: 'Failed to create customer' }, 500)
  }
}

export async function getStats(c: Context, db: D1Database) {
  try {
    const stats = await getCustomerStats(db)
    return c.json(stats)
  } catch (error) {
    return c.json({ error: 'Failed to fetch stats' }, 500)
  }
}
