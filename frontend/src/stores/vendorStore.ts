import { defineStore } from 'pinia'
import { ref } from 'vue'
import { VendorService } from '../services/VendorService'
import type { Vendor } from '../types/Vendor'

export const useVendorStore = defineStore('vendor', () => {
  const vendors = ref<Vendor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchVendors() {
    loading.value = true
    error.value = null
    
    try {
      vendors.value = (await VendorService.getVendors()).reverse();
    } catch (err) {
      error.value = 'Failed to load vendors. Please try again later.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addVendor(vendor: Vendor) {
    loading.value = true
    error.value = null
    
    try {
      await VendorService.createVendor(vendor)
      // Refresh the vendors list after adding a new vendor
      await fetchVendors()
    } catch (err) {
      error.value = 'Failed to add vendor. Please try again later.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    addVendor
  }
})