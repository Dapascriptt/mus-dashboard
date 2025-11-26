import { defineStore } from 'pinia'
import { getCustomers } from '../services/customerService'

export const useCustomerStore = defineStore('customerStore', {
  state: () => ({
    customers: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCustomers() {
      this.loading = true
      this.error = null
      try {
        const res = await getCustomers()
        this.customers = res.data
      } catch (err) {
        this.error = 'Gagal mengambil data customer'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})
