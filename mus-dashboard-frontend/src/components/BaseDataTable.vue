<!-- src/components/BaseDataTable.vue -->
<template>
  <div class="w-full bg-slate-900/70 border border-slate-800 rounded-xl shadow-md overflow-hidden">
    <!-- Header (title + search) -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-b border-slate-800"
    >
      <div>
        <h2 v-if="title" class="text-sm font-semibold text-slate-100">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-xs text-slate-400 mt-0.5">
          {{ subtitle }}
        </p>
      </div>

      <!-- Search -->
      <div v-if="searchable" class="flex items-center gap-3">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-56 md:w-64 px-3 py-2 rounded-md bg-slate-900 border border-slate-700
                   text-xs text-slate-200 placeholder:text-slate-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <!-- ekstra header slot (misal tombol Add) -->
        <slot name="header-right" />
      </div>

      <!-- kalau nggak butuh search tapi mau slot -->
      <div v-else>
        <slot name="header-right" />
      </div>
    </div>

    <!-- Tabel / kosong / loading -->
    <div class="w-full overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-900/90 border-b border-slate-800">
          <tr class="text-left text-slate-300">
            <th
              v-if="showIndex"
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide border-r border-slate-800"
            >
              #
            </th>

            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              :class="[
                col.headerClass,
                col.sortable !== false ? 'cursor-pointer select-none' : ''
              ]"
              @click="col.sortable !== false && changeSort(col.key)"
            >
              <span class="inline-flex items-center gap-1">
                {{ col.label }}
                <span
                  v-if="sortKey === col.key"
                  class="text-[10px]"
                >
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- loading -->
          <tr v-if="loading">
            <td
              :colspan="columns.length + (showIndex ? 1 : 0)"
              class="px-4 py-6 text-center text-xs text-slate-300"
            >
              Loading data...
            </td>
          </tr>

          <!-- kosong -->
          <tr v-else-if="!paginatedRows.length">
            <td
              :colspan="columns.length + (showIndex ? 1 : 0)"
              class="px-4 py-6 text-center text-xs text-slate-400"
            >
              Belum ada data yang ditampilkan.
            </td>
          </tr>

          <!-- isi -->
          <tr
            v-else
            v-for="(row, index) in paginatedRows"
            :key="getRowKey(row, index)"
            class="border-b border-slate-800/70 odd:bg-slate-900/40 even:bg-slate-900/20 hover:bg-slate-800/60 transition-colors"
          >
            <td
              v-if="showIndex"
              class="px-4 py-2 text-xs text-slate-400"
            >
              {{ startItem + index }}
            </td>

            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-2 align-middle"
              :class="col.cellClass"
            >
              <slot
                :name="col.key"
                :row="row"
                :value="row[col.key]"
              >
                {{ formatValue(row[col.key]) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-3 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-300"
    >
      <div>
        Menampilkan
        <span class="font-semibold">{{ totalItems === 0 ? 0 : startItem }}</span>
        -
        <span class="font-semibold">{{ totalItems === 0 ? 0 : endItem }}</span>
        dari
        <span class="font-semibold">{{ totalItems }}</span>
        data
      </div>

      <div class="flex items-center gap-2 self-end md:self-auto">
        <button
          class="px-2 py-1 rounded-md border border-slate-700 bg-slate-900/80 disabled:opacity-40 text-xs"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Prev
        </button>
        <span>
          Page
          <span class="font-semibold">{{ currentPage }}</span>
          / {{ totalPages }}
        </span>
        <button
          class="px-2 py-1 rounded-md border border-slate-700 bg-slate-900/80 disabled:opacity-40 text-xs"
          :disabled="currentPage === totalPages || totalPages === 0"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  rowKey: {
    type: String,
    default: '_id'
  },
  showIndex: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10 // <= max 10 data per halaman
  },
  searchable: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari...'
  },
  defaultSortKey: {
    type: String,
    default: null
  },
  defaultSortDirection: {
    type: String,
    default: 'asc' // 'asc' | 'desc'
  }
})

const searchTerm = ref('')
const currentPage = ref(1)
const sortKey = ref(props.defaultSortKey || (props.columns[0]?.key ?? null))
const sortDirection = ref(props.defaultSortDirection)

const searchableColumns = computed(() =>
  props.columns.filter(col => col.searchable !== false)
)

const formatValue = (val) => {
  if (val === null || val === undefined || val === '') return '-'
  return val
}

const getRowKey = (row, index) => {
  return row[props.rowKey] ?? row.id ?? index
}

// ===== FILTER (search) =====
const filteredRows = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return props.data || []

  return (props.data || []).filter(row => {
    return searchableColumns.value.some(col => {
      const value = row[col.key]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(q)
    })
  })
})

// ===== SORT =====
const changeSort = (field) => {
  if (!field) return
  if (sortKey.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = field
    sortDirection.value = 'asc'
  }
}

const sortedRows = computed(() => {
  const list = [...filteredRows.value]
  if (!sortKey.value) return list

  return list.sort((a, b) => {
    const key = sortKey.value
    let va = a[key]
    let vb = b[key]

    if (va == null) va = ''
    if (vb == null) vb = ''

    const na = Number(va)
    const nb = Number(vb)

    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return sortDirection.value === 'asc' ? na - nb : nb - na
    }

    const sa = String(va).toLowerCase()
    const sb = String(vb).toLowerCase()

    if (sa < sb) return sortDirection.value === 'asc' ? -1 : 1
    if (sa > sb) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

// ===== PAGINATION =====
const totalItems = computed(() => sortedRows.value.length)

const totalPages = computed(() =>
  totalItems.value === 0 ? 0 : Math.ceil(totalItems.value / props.pageSize)
)

const paginatedRows = computed(() => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1
  }

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return sortedRows.value.slice(start, end)
})

const startItem = computed(() =>
  totalItems.value === 0 ? 0 : (currentPage.value - 1) * props.pageSize + 1
)

const endItem = computed(() =>
  Math.min(currentPage.value * props.pageSize, totalItems.value)
)

const goToPage = (page) => {
  if (page < 1) return
  if (page > totalPages.value) return
  currentPage.value = page
}
</script>
