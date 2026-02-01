export interface Customer {
  CustomerId: number
  CompanyName: string
  ContactName: string
}

export interface CreateCustomerInput {
  companyName: string
  contactName: string
}
