<template>
  <div class="vendor-list">
    <h2>Vendor List</h2>
    <div v-if="vendorStore.loading">Loading vendors...</div>
    <div v-else-if="vendorStore.error" class="error">{{ vendorStore.error }}</div>
    <div v-else-if="vendorStore.vendors.length === 0" class="no-vendors">No vendors found. Add your first vendor!</div>
    <table v-else class="vendors-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Contact Person</th>
          <th>Email</th>
          <th>Partner Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vendor in vendorStore.vendors" :key="vendor.id">
          <td>{{ vendor.id }}</td>
          <td>{{ vendor.name }}</td>
          <td>{{ vendor.contact_person }}</td>
          <td>{{ vendor.email }}</td>
          <td>{{ vendor.partner_type }}</td>
          <td>
            <button class="delete-btn" @click.stop="onDelete(vendor.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useVendorStore } from '../stores/vendorStore';

// Using the vendor store directly, no need for local props or state
const vendorStore = useVendorStore();

onMounted(() => {
  vendorStore.fetchVendors();
});

/* delete vendor with id
 add a confirmation dialog
 if confirmed, delete the vendor
 if not confirmed, do nothing
 */

function onDelete(id?: number) {
  if (!id) return;
  const confirmed = window.confirm('Are you sure you want to delete this vendor?');
  if (!confirmed) return;
  vendorStore.deleteVendor(id);
}
</script>

<style scoped>
.vendor-list {
  margin: 20px 0;
}

.vendors-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.vendors-table th,
.vendors-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.vendors-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.vendors-table tr:hover {
  background-color: #f5f5f5;
}

.error {
  color: red;
  padding: 10px;
}

.no-vendors {
  padding: 20px;
  text-align: center;
  color: #666;
}

.delete-btn {
  background-color: #e53e3e;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c53030;
}
</style>