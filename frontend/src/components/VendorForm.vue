<template>
  <div class="vendor-form">
    <h2>Add New Vendor</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input 
          id="name" 
          v-model="form.name" 
          type="text" 
          required 
          placeholder="Company name"
        />
      </div>
      
      <div class="form-group">
        <label for="contactPerson">Contact Person:</label>
        <input 
          id="contactPerson" 
          v-model="form.contact_person" 
          type="text" 
          required 
          placeholder="Contact person name"
        />
      </div>
      
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          required 
          placeholder="contact@example.com"
          @blur="onEmailBlur"
        />
        <div v-if="emailError" class="email-error-message">{{ emailError }}</div>
        <div v-if="emailChecking" class="email-checking-message">Checking email availability...</div>
      </div>
      
      <div class="form-group">
        <label for="partnerType">Partner Type:</label>
        <select 
          id="partnerType" 
          v-model="form.partner_type" 
          required
        >
          <option value="Supplier">Supplier</option>
          <option value="Partner">Partner</option>
        </select>
      </div>
      
      <div class="form-actions">
        <button type="submit" :disabled="vendorStore.loading || success || emailChecking">
          {{ vendorStore.loading ? 'Submitting...' : (success ? 'Please wait…' : 'Add Vendor') }}
        </button>
        <div v-if="vendorStore.error" class="error-message">{{ vendorStore.error }}</div>
        <div v-if="success" class="success-message">Vendor added successfully!</div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVendorStore } from '../stores/vendorStore';
import type { Vendor } from '../types/Vendor';

const vendorStore = useVendorStore();

const form = reactive<Vendor>({
  name: '',
  contact_person: '',
  email: '',
  partner_type: 'Supplier'
});

const success = ref(false);
const emailError = ref<string | null>(null);
const emailChecking = ref(false);
const lastDuplicateEmail = ref<string | null>(null);

const resetForm = () => {
  form.name = '';
  form.contact_person = '';
  form.email = '';
  form.partner_type = 'Supplier';
  emailError.value = null;
};

// Email duplication is checked on submit only

const submitForm = async () => {
  if (vendorStore.loading || success.value) return;
  success.value = false;
  emailError.value = null;

  // Pre-check email duplication on submit
  const isDuplicate = await checkEmailDuplication();
  if (isDuplicate) return;

  try {
    await vendorStore.addVendor({ ...form });
    success.value = true;
    
    // Reset the form after successful submission
    setTimeout(() => {
      resetForm();
      success.value = false;
    }, 2000);
  } catch (err) {
    // Error is already handled in the store
  }
};

// Returns true if email is duplicate, otherwise false
const checkEmailDuplication = async (): Promise<boolean> => {
  if (!form.email || form.email.length < 3) {
    emailError.value = null;
    return false;
  }

  emailChecking.value = true;
  emailError.value = null;
  try {
    const result = await vendorStore.checkEmailAvailability(form.email);
    if (result.exists) {
      emailError.value = `This email is already registered to ${result.vendorName || 'another vendor'}`;
      lastDuplicateEmail.value = form.email;
      return true;
    }
    lastDuplicateEmail.value = null;
    return false;
  } catch (err) {
    console.error('Error checking email:', err);
    return false;
  } finally {
    emailChecking.value = false;
  }
};

// Clears email error on blur if user has changed the email since duplication error
const onEmailBlur = () => {
  if (!emailError.value) return;
  if (!lastDuplicateEmail.value) return;
  const current = (form.email || '').trim().toLowerCase();
  const previous = lastDuplicateEmail.value.trim().toLowerCase();
  if (current && current !== previous) {
    emailError.value = null;
  }
};
</script>

<style scoped>
.vendor-form {
  max-width: 500px;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  margin-top: 10px;
}

.success-message {
  color: #4CAF50;
  margin-top: 10px;
}

.email-error-message {
  color: #f44336;
  margin-top: 5px;
  font-size: 14px;
  text-align: left;
}

.email-checking-message {
  color: #2196F3;
  margin-top: 5px;
  font-size: 14px;
  font-style: italic;
}
</style>