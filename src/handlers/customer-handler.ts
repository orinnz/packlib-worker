import type { Context } from 'hono'
import type { CustomerService } from '../services/customer-service'

export class CustomerHandler {
  constructor(private service: CustomerService) {}

  async listCustomers(c: Context) {
    try {
      const customers = await this.service.getAllCustomers()
      return c.json({ customers })
    } catch (error) {
      return c.json({ error: 'Failed to fetch customers' }, 500)
    }
  }

  async getCustomer(c: Context) {
    const customerId = Number(c.req.param('id'))

    try {
      const customer = await this.service.getCustomerById(customerId)

      if (!customer) {
        return c.json({ error: 'Customer not found' }, 404)
      }

      return c.json({ customer })
    } catch (error) {
      return c.json({ error: 'Failed to fetch customer' }, 500)
    }
  }

  async createCustomer(c: Context) {
    try {
      const body = await c.req.json<{ companyName: string; contactName: string }>()

      await this.service.createCustomer({
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

  async getStats(c: Context) {
    try {
      const stats = await this.service.getCustomerStats()
      return c.json(stats)
    } catch (error) {
      return c.json({ error: 'Failed to fetch stats' }, 500)
    }
  }
}
