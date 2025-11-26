<template>
  <div class="space-y-4 text-white">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Customer List</h1>
        
      </div>

      <div class="flex items-center gap-3">
        <!-- Search otomatis handled di BaseDataTable -->
        <input
          v-model="searchTerm"
          placeholder="Cari nama / email / phone..."
          class="w-64 px-3 py-2 rounded-md bg-slate-900 border border-slate-700
          text-xs text-slate-200 placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <router-link to="/customers/add">
          <el-button type="primary">+ Add Customer</el-button>
        </router-link>
      </div>
    </div>

    <!-- Table Reusable -->
    <BaseDataTable
      :data="customers"
      :columns="columns"
      :loading="loading"
      :search="searchTerm"
      search-placeholder="Cari nama / email / phone..."
      row-key="_id"
      page-size="10"
    >
      <!-- Custom cell slot: Address -->
      <template #address="{ value }">
        <span class="text-slate-300">{{ value }}</span>
      </template>

      <!-- Custom cell slot: createdAt -->
      <template #createdAt="{ value }">
        {{ formatDate(value) }}
      </template>

      <!-- Custom cell slot: actions -->
      <template #actions="{ row }">
        <div class="text-right space-x-2">
          <router-link :to="`/customers/edit/${getId(row)}`">
            <el-button type="primary" size="small">Edit</el-button>
          </router-link>

          <el-button size="small" type="danger" @click="handleDelete(row)">
            Delete
          </el-button>
        </div>
      </template>
    </BaseDataTable>

    <!-- Empty -->
    <div v-if="!loading && customers.length === 0" class="text-slate-400 mt-4">
      Belum ada customer.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCustomerStore } from "../stores/customerStore";
import BaseDataTable from "../components/BaseDataTable.vue";
import { deleteCustomer } from "../services/CustomerService";
import { ElMessageBox, ElMessage } from "element-plus";
import { storeToRefs } from "pinia";

const customerStore = useCustomerStore();
const { customers, loading, error } = storeToRefs(customerStore);

onMounted(() => customerStore.fetchCustomers());

// Helpers
const getId = (c) => c._id || c.id;
const formatDate = (v) => new Date(v).toLocaleString("id-ID");

// Search state
const searchTerm = ref("");

// BaseDataTable column schema
const columns = [
  { label: "Name", key: "name", sortable: true, searchable: true },
  { label: "Email", key: "email", sortable: true, searchable: true },
  { label: "Phone", key: "phone", sortable: true, searchable: true },
  {
    label: "Address",
    key: "address",
    sortable: false,
    searchable: true,
    cellClass: "text-slate-300",
  },
  { label: "Created", key: "createdAt", sortable: true },
  {
    label: "Actions",
    key: "actions",
    sortable: false,
    searchable: false,
    cellClass: "text-right w-44",
  },
];

// DELETE
const handleDelete = async (customer) => {
  try {
    await ElMessageBox.confirm(
      `Hapus customer "${customer.name}"?`,
      "Konfirmasi",
      { type: "warning" }
    );

    await deleteCustomer(getId(customer));
    await customerStore.fetchCustomers();

    ElMessage.success("Customer berhasil dihapus!");
  } catch (err) {
    // user cancel: do nothing
  }
};
</script>
