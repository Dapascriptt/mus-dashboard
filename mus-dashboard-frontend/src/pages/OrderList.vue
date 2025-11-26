<template>
  <div class="space-y-4 text-white">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Order List</h1>
        
      </div>

      <router-link to="/orders/add">
        <el-button type="primary">+ Add Order</el-button>
      </router-link>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-sm text-red-400">
      {{ error }}
    </div>

    <!-- Tabel reusable -->
    <BaseDataTable
      title="Orders"
      subtitle="Menampilkan daftar order dengan search, sort, dan pagination (10/order)"
      :columns="columns"
      :data="orders"
      :loading="loading"
      row-key="_id"
      :page-size="10"
      searchable
      search-placeholder="Cari order # / customer / status..."
    >
      <!-- Kolom: Total -->
      <template #totalAmount="{ value }">
        {{ formatPrice(value) }}
      </template>

      <!-- Kolom: Status -->
      <template #status="{ value }">
        <span
          class="px-2 py-0.5 rounded-full text-xs"
          :class="statusClass(value)"
        >
          {{ value }}
        </span>
      </template>

      <!-- Kolom: Created At -->
      <template #createdAt="{ value }">
        {{ formatDate(value) }}
      </template>

      <!-- Kolom: Actions -->
      <template #actions="{ row }">
        <div class="text-right space-x-2">
          <router-link :to="`/orders/${getId(row)}`">
            <el-button size="small" type="primary">
              Detail
            </el-button>
          </router-link>

          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
          >
            Delete
          </el-button>
        </div>
      </template>
    </BaseDataTable>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessageBox, ElMessage } from 'element-plus'
import BaseDataTable from '../components/BaseDataTable.vue'
import { useOrderStore } from '../stores/orderStore'
import { deleteOrder } from '../services/orderService'

const orderStore = useOrderStore()
const { orders, loading, error } = storeToRefs(orderStore)

onMounted(() => {
  orderStore.fetchOrders()
})

// ===== Kolom untuk BaseDataTable =====
const columns = [
  { label: 'Order #', key: 'orderNumber', sortable: true },
  { label: 'Customer', key: 'customerName', sortable: true },
  { label: 'Total', key: 'totalAmount', sortable: true, cellClass: 'text-right' },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Created At', key: 'createdAt', sortable: true },
  {
    label: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false,
    cellClass: 'text-right w-44'
  }
]

// Helpers
const getId = (o) => o._id || o.id

const formatPrice = (v) => {
  const num = Number(v)
  if (Number.isNaN(num)) return '-'
  return 'Rp ' + num.toLocaleString('id-ID')
}

const formatDate = (v) => {
  if (!v) return '-'
  return new Date(v).toLocaleString('id-ID')
}

const statusClass = (s) => ({
  pending: 'bg-yellow-500/15 text-yellow-300',
  paid: 'bg-emerald-500/15 text-emerald-300',
  shipped: 'bg-sky-500/15 text-sky-300',
  cancelled: 'bg-red-500/15 text-red-300'
}[s] || 'bg-slate-600/20 text-slate-300')

// DELETE
const handleDelete = async (order) => {
  try {
    await ElMessageBox.confirm(
      `Hapus order ${order.orderNumber}?`,
      'Konfirmasi',
      { type: 'warning' }
    )

    await deleteOrder(getId(order))
    await orderStore.fetchOrders()

    ElMessage.success('Order berhasil dihapus!')
  } catch {
    // user cancel → diam saja
  }
}
</script>
