import { defineStore } from 'pinia'
import { ref } from 'vue'
import { VendorService } from '../services/VendorService'
import type { Vendor, EmailCheckResponse } from '../types/Vendor'

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
/*
  deleteVendor(id: number)
  call the delete API
  if successful, update the store’s vendors array locally (filter out the deleted id) instead of refetching the whole list from the server. This keeps the UI snappy and reduces network load.
  if not successful, show an error message
 */
  async function deleteVendor(id: number) {
    loading.value = true
    error.value = null
    
    try {
      await VendorService.deleteVendor(String(id))
      vendors.value = vendors.value.filter(v => v.id !== id)
    } catch (err) {
      error.value = 'Failed to delete vendor. Please try again later.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkEmailAvailability(email: string): Promise<EmailCheckResponse> {
    try {
      return await VendorService.checkEmailExists(email)
    } catch (err) {
      console.error('Error checking email availability:', err)
      throw err
    }
  }

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    addVendor,
    deleteVendor,
    checkEmailAvailability
  }
})