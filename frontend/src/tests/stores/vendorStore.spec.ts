import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useVendorStore } from '../../stores/vendorStore';
import { VendorService } from '../../services/VendorService';
import type { Vendor } from '../../types/Vendor';

// Mock the VendorService
vi.mock('../../services/VendorService', () => ({
  VendorService: {
    getVendors: vi.fn(),
    createVendor: vi.fn()
  }
}));

describe('VendorStore', () => {
  const mockVendors: Vendor[] = [
    {
      id: 1,
      name: 'Test Company 1',
      contact_person: 'John Test',
      email: 'john@testcompany.com',
      partner_type: 'Supplier'
    },
    {
      id: 2,
      name: 'Test Company 2',
      contact_person: 'Jane Test',
      email: 'jane@testcompany.com',
      partner_type: 'Partner'
    }
  ];
  
  beforeEach(() => {
    setActivePinia(createPinia());
    
    // Reset mocks
    vi.mocked(VendorService.getVendors).mockReset();
    vi.mocked(VendorService.createVendor).mockReset();
  });

  it('has initial state', () => {
    const store = useVendorStore();
    
    expect(store.vendors).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });

  describe('fetchVendors', () => {
    it('updates state with vendors from API', async () => {
      vi.mocked(VendorService.getVendors).mockResolvedValue(mockVendors);
      
      const store = useVendorStore();
      await store.fetchVendors();
      
      expect(store.vendors).toEqual(mockVendors.reverse());
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });
    
    it('sets loading state during API call', async () => {
      // Create a promise that we can resolve manually
      let resolvePromise: (value: Vendor[]) => void = () => {};
      const promise = new Promise<Vendor[]>(resolve => {
        resolvePromise = resolve;
      });
      
      vi.mocked(VendorService.getVendors).mockReturnValue(promise);
      
      const store = useVendorStore();
      const fetchPromise = store.fetchVendors();
      
      // Check loading state during API call
      expect(store.loading).toBe(true);
      
      // Resolve the promise
      resolvePromise(mockVendors);
      await fetchPromise;
      
      // Check loading is false after promise resolves
      expect(store.loading).toBe(false);
    });
    
    it('handles API errors correctly', async () => {
      const error = new Error('Network error');
      vi.mocked(VendorService.getVendors).mockRejectedValue(error);
      
      const store = useVendorStore();
      await store.fetchVendors();
      
      expect(store.loading).toBe(false);
      expect(store.error).toBe('Failed to load vendors. Please try again later.');
      expect(store.vendors).toEqual([]);
    });
  });
  
  describe('addVendor', () => {
    const newVendor: Vendor = {
      name: 'New Company',
      contact_person: 'New Person',
      email: 'new@company.com',
      partner_type: 'Supplier'
    };
    
    it('calls API and refreshes vendor list', async () => {
      // Mock API calls
      vi.mocked(VendorService.createVendor).mockResolvedValue({ ...newVendor, id: 3 });
      vi.mocked(VendorService.getVendors).mockResolvedValue([...mockVendors, {...newVendor, id: 3}]);
      
      const store = useVendorStore();
      await store.addVendor(newVendor);
      
      // Verify API was called correctly
      expect(VendorService.createVendor).toHaveBeenCalledWith(newVendor);
      expect(VendorService.getVendors).toHaveBeenCalled();
      
      // Verify store was updated
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
      expect(store.vendors.length).toBe(3);
    });
    
    it('handles API errors correctly', async () => {
      const error = new Error('API error');
      vi.mocked(VendorService.createVendor).mockRejectedValue(error);
      
      const store = useVendorStore();
      
      try {
        await store.addVendor(newVendor);
        // If we get here, the test should fail because the function should throw
        expect(true).toBe(false); 
      } catch (e) {
        expect(store.loading).toBe(false);
        expect(store.error).toBe('Failed to add vendor. Please try again later.');
      }
    });
  });
});