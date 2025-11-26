<!-- src/pages/ProductList.vue -->
<template>
  <div class="space-y-4 text-white">
    <!-- Header atas -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Product List</h1>
        
      </div>

      <router-link to="/products/add">
        <el-button type="primary">+ Add Product</el-button>
      </router-link>
    </div>

    <!-- Info / Error -->
    <div v-if="error" class="mb-2 text-sm text-red-400">
      {{ error }}
    </div>

    <!-- Tabel -->
    <BaseDataTable
      title="Products"
      subtitle="Menampilkan data produk dengan pencarian, sort, dan pagination"
      :columns="columns"
      :data="products"
      :loading="loading"
      row-key="_id"
      :page-size="10"
      searchable
      search-placeholder="Cari nama / SKU / kategori / status..."
    >
      <!-- price -->
      <template #price="{ value }">
        {{ formatPrice(value) }}
      </template>

      <!-- status -->
      <template #status="{ value }">
        <span
          class="px-2 py-0.5 rounded-full text-xs font-medium"
          :class="
            value === 'active'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-600/20 text-slate-300 border border-slate-600/40'
          "
        >
          {{ value }}
        </span>
      </template>

      <!-- actions -->
      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <router-link :to="`/products/edit/${row._id}`">
            <el-button type="primary" size="small">
              Edit
            </el-button>
          </router-link>

          <el-button
            type="danger"
            size="small"
            @click="onDelete(row._id)"
          >
            Delete
          </el-button>
        </div>
      </template>
    </BaseDataTable>

    <!-- Modal konfirmasi delete -->
    <el-dialog
      v-model="showDeleteModal"
      title="Delete Product"
      width="400px"
    >
      <span>Yakin ingin menghapus produk ini?</span>
      <template #footer>
        <el-button @click="showDeleteModal = false">Cancel</el-button>
        <el-button type="danger" :loading="deleting" @click="handleDelete">
          Delete
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseDataTable from '../components/BaseDataTable.vue'
import { getProducts, deleteProduct } from '../services/ProductService'

const products = ref([])
const loading = ref(false)
const deleting = ref(false)
const error = ref('')
const showDeleteModal = ref(false)
const deleteId = ref(null)

// definisi kolom (sort otomatis by key)
const columns = [
  { label: 'Name', key: 'name', sortable: true },
  { label: 'SKU', key: 'sku', sortable: true },
  { label: 'Price', key: 'price', sortable: true, cellClass: 'text-right' },
  { label: 'Stock', key: 'stock', sortable: true },
  { label: 'Category', key: 'category', sortable: true },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Actions', key: 'actions', sortable: false, cellClass: 'text-right w-40' }
]

const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getProducts()
    products.value = res.data
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data produk.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const formatPrice = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return '-'
  return 'Rp ' + num.toLocaleString('id-ID')
}

const onDelete = (id) => {
  deleteId.value = id
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deleteId.value) return
  deleting.value = true
  try {
    await deleteProduct(deleteId.value)
    showDeleteModal.value = false
    deleteId.value = null
    await fetchProducts()
  } catch (err) {
    console.error(err)
    error.value = 'Gagal menghapus produk.'
  } finally {
    deleting.value = false
  }
}
</script>
