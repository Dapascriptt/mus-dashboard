<template>
  <div class="p-4 text-white space-y-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Dashboard</h1>
        <p class="text-sm text-slate-400">
          Ringkasan performa penjualan dan aktivitas toko.
        </p>
      </div>
    </div>

    <!-- OVERVIEW CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="card in overviewCards"
        :key="card.title"
        class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-sm"
      >
        <!-- ICON -->
        <div
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            card.iconBg
          ]"
        >
          <!-- Orders -->
          <svg
            v-if="card.icon === 'orders'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M7 3h10l2 3v15l-3-2-3 2-3-2-3 2V6z" />
            <path d="M9 9h6M9 13h4" />
          </svg>

          <!-- Revenue -->
          <svg
            v-else-if="card.icon === 'revenue'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 1v22" />
            <path
              d="M17 5H10.5a3.5 3.5 0 0 0 0 7h3a3.5 3.5 0 0 1 0 7H7"
            />
          </svg>

          <!-- Customers -->
          <svg
            v-else-if="card.icon === 'customers'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm8 0a3 3 0 1 0-3-3" />
            <path d="M2 21a6 6 0 0 1 12 0M14 18a4 4 0 0 1 8 3" />
          </svg>

          <!-- Products -->
          <svg
            v-else-if="card.icon === 'products'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5z" />
            <path d="M3 7.5v9L12 21l9-4.5v-9" />
            <path d="M12 12v9" />
          </svg>
        </div>

        <!-- TEXT -->
        <div class="flex-1">
          <p class="text-xs uppercase tracking-wide text-slate-400">
            {{ card.title }}
          </p>
          <p class="text-xl font-semibold mt-1">
            {{ card.value }}
          </p>
        </div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Revenue Over Time -->
      <div
        class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 h-72 flex flex-col"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold">Revenue Over Time</h2>
          <span class="text-xs text-slate-400">berdasarkan tanggal order</span>
        </div>

        <div class="flex-1">
          <LineChart v-if="chartRevenue.length" :data="chartRevenue" />
          <p
            v-else-if="!loading"
            class="text-sm text-slate-500 flex items-center justify-center h-full"
          >
            Belum ada data revenue.
          </p>
        </div>
      </div>

      <!-- Orders by Status -->
      <div
        class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 h-72 flex flex-col"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold">Orders by Status</h2>
          <span class="text-xs text-slate-400">ringkasan status pesanan</span>
        </div>

        <div class="flex-1">
          <BarChart v-if="chartOrderStatus.length" :data="chartOrderStatus" />
          <p
            v-else-if="!loading"
            class="text-sm text-slate-500 flex items-center justify-center h-full"
          >
            Belum ada data order.
          </p>
        </div>
      </div>

      <!-- Revenue by Status (Pie) -->
      <div
        class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 h-72 flex flex-col overflow-hidden"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold">Revenue by Status</h2>
          <span class="text-xs text-slate-400">hanya paid & shipped</span>
        </div>

        <div class="flex-1 min-h-0 flex items-center justify-center">
          <PieChart
            v-if="chartRevenueByStatus.length"
            :data="chartRevenueByStatus"
          />
          <p
            v-else-if="!loading"
            class="text-sm text-slate-500 flex items-center justify-center h-full"
          >
            Belum ada data revenue by status.
          </p>
        </div>
      </div>
    </div>

    <!-- ERROR / LOADING -->
    <p v-if="loading" class="text-sm text-slate-400">
      Memuat data dashboard...
    </p>
    <p v-if="error" class="text-sm text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import LineChart from "../components/charts/LineChart.vue";
import BarChart from "../components/charts/BarChart.vue";
import PieChart from "../components/charts/PieChart.vue";
import {
  getAnalyticsOverview,
  getAnalyticsRevenue,
  getAnalyticsOrderStatus,
  getAnalyticsCustomers,
} from "../services/AnalyticsService";

const loading = ref(false);
const error = ref("");

const overview = ref({
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  totalProducts: 0,
});

const chartRevenue = ref([]);
const chartOrderStatus = ref([]);
const chartRevenueByStatus = ref([]);

const overviewCards = computed(() => [
  {
    title: "Total Orders",
    value: overview.value.totalOrders ?? 0,
    icon: "orders",
    iconBg: "bg-indigo-500/15 text-indigo-300",
  },
  {
    title: "Total Revenue",
    value:
      "Rp " +
      Number(overview.value.totalRevenue || 0).toLocaleString("id-ID"),
    icon: "revenue",
    iconBg: "bg-emerald-500/15 text-emerald-300",
  },
  {
    title: "Total Customers",
    value: overview.value.totalCustomers ?? 0,
    icon: "customers",
    iconBg: "bg-sky-500/15 text-sky-300",
  },
  {
    title: "Total Products",
    value: overview.value.totalProducts ?? 0,
    icon: "products",
    iconBg: "bg-amber-500/15 text-amber-300",
  },
]);

onMounted(async () => {
  loading.value = true;
  error.value = "";

  try {
    const [overviewRes, revenueRes, orderStatusRes, revenueStatusRes] = await Promise.all([
      getAnalyticsOverview(),
      getAnalyticsRevenue(),
      getAnalyticsOrderStatus(),
      getAnalyticsCustomers(),
    ]);

    overview.value = overviewRes.data || overview.value;
    chartRevenue.value = revenueRes.data || [];
    chartOrderStatus.value = orderStatusRes.data || [];
    chartRevenueByStatus.value = revenueStatusRes.data || [];
  } catch (err) {
    console.error(err);
    error.value = "Gagal memuat data dashboard.";
  } finally {
    loading.value = false;
  }
});
</script>
