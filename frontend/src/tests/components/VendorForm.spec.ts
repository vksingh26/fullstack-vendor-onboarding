import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import VendorForm from '../../components/VendorForm.vue';
import { useVendorStore } from '../../stores/vendorStore';

describe('VendorForm', () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: false, error: null }
            }
          })
        ]
      }
    });
    
    expect(wrapper.find('h2').text()).toBe('Add New Vendor');
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Add Vendor');
  });

  it('contains all required form fields', () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: false, error: null }
            }
          })
        ]
      }
    });
    
    // Check that all expected form inputs exist
    expect(wrapper.find('#name').exists()).toBe(true);
    expect(wrapper.find('#contactPerson').exists()).toBe(true);
    expect(wrapper.find('#email').exists()).toBe(true);
    expect(wrapper.find('#partnerType').exists()).toBe(true);
    
    // Check that dropdown contains the right options
    const options = wrapper.findAll('#partnerType option');
    expect(options.length).toBe(2);
    expect(options[0].text()).toBe('Supplier');
    expect(options[1].text()).toBe('Partner');
  });

  it('submits form data correctly', async () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: false, error: null }
            }
          })
        ]
      }
    });
    
    const store = useVendorStore();
    
    // Fill out the form
    await wrapper.find('#name').setValue('Test Company');
    await wrapper.find('#contactPerson').setValue('John Test');
    await wrapper.find('#email').setValue('john@testcompany.com');
    await wrapper.find('#partnerType').setValue('Partner');
    
    // Submit the form
    await wrapper.find('form').trigger('submit');
    
    // Check that the store's addVendor method was called with correct data
    expect(store.addVendor).toHaveBeenCalledWith({
      name: 'Test Company',
      contact_person: 'John Test',
      email: 'john@testcompany.com',
      partner_type: 'Partner'
    });
  });

  it('shows loading state when submitting', async () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: true, error: null }
            }
          })
        ]
      }
    });
    
    // Check that the submit button shows loading text
    expect(wrapper.find('button[type="submit"]').text()).toBe('Submitting...');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
  });

  it('shows error message when submission fails', async () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              vendor: { loading: false, error: 'Failed to add vendor' }
            }
          })
        ]
      }
    });
    
    // Check that error message is shown
    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toBe('Failed to add vendor');
  });
});