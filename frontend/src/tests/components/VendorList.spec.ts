import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import VendorList from '../../components/VendorList.vue';
import { useVendorStore } from '../../stores/vendorStore';
import type { Vendor } from '../../types/Vendor';

describe('VendorList', () => {
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
    // Reset mocks between tests
    vi.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    });
    expect(wrapper.find('h2').text()).toBe('Vendor List');
  });

  it('calls fetchVendors on mount', () => {
    mount(VendorList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    });
    
    const store = useVendorStore();
    expect(store.fetchVendors).toHaveBeenCalledTimes(1);
  });

  it('displays loading message when loading', () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: true, vendors: [], error: null }
            }
          })
        ]
      }
    });
    
    expect(wrapper.text()).toContain('Loading vendors...');
    expect(wrapper.find('.vendors-table').exists()).toBe(false);
  });

  it('displays error message when there is an error', () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: false, vendors: [], error: 'Failed to load vendors' }
            }
          })
        ]
      }
    });
    
    expect(wrapper.find('.error').exists()).toBe(true);
    expect(wrapper.find('.error').text()).toBe('Failed to load vendors');
    expect(wrapper.find('.vendors-table').exists()).toBe(false);
  });

  it('displays "no vendors" message when vendor list is empty', () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: false, vendors: [], error: null }
            }
          })
        ]
      }
    });
    
    expect(wrapper.find('.no-vendors').exists()).toBe(true);
    expect(wrapper.text()).toContain('No vendors found');
    expect(wrapper.find('.vendors-table').exists()).toBe(false);
  });

  it('displays vendor table with correct data when vendors are available', () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: false, vendors: mockVendors, error: null }
            }
          })
        ]
      }
    });
    
    // Check that the table exists and has correct structure
    expect(wrapper.find('.vendors-table').exists()).toBe(true);
    expect(wrapper.findAll('th').length).toBe(5);
    expect(wrapper.findAll('tbody tr').length).toBe(2);
    
    // Check content of first row
    const firstRow = wrapper.findAll('tbody tr')[0];
    expect(firstRow.findAll('td')[0].text()).toBe('1');
    expect(firstRow.findAll('td')[1].text()).toBe('Test Company 1');
    expect(firstRow.findAll('td')[2].text()).toBe('John Test');
    expect(firstRow.findAll('td')[3].text()).toBe('john@testcompany.com');
    expect(firstRow.findAll('td')[4].text()).toBe('Supplier');
  });
});