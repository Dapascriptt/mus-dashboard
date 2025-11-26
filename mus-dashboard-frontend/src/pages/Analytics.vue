<template>
  <div class="space-y-4 text-white">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Analytics</h1>
        <p class="text-xs text-slate-400">
          Ringkasan performa orders, revenue, dan produk.
        </p>
      </div>
    </div>

    <!-- Error & Loading -->
    <div v-if="error" class="text-sm text-red-400">
      {{ error }}
    </div>
    <div v-if="loading" class="text-sm text-slate-300">
      Loading analytics...
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        v-for="card in overviewCards"
        :key="card.title"
        class="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-4"
      >
        <!-- ICON -->
        <div
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            card.iconBg
          ]"
        >
          <component :is="card.icon" class="w-5 h-5"></component>
        </div>

        <!-- TEXT -->
        <div>
          <p class="text-xs text-slate-400 uppercase tracking-wide">
            {{ card.title }}
          </p>
          <h2 class="text-xl font-semibold mt-1">
            {{ card.value }}
          </h2>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Line: Revenue Over Time -->
      <div
        class="bg-slate-900/70 p-4 rounded-xl border border-slate-800
               h-[340px] flex flex-col overflow-hidden"
      >
        <h2 class="text-lg mb-2">Revenue Over Time</h2>
        <div class="flex-1 min-h-0">
          <LineChart :data="chartRevenue" />
        </div>
      </div>

      <!-- Bar: Orders by Status -->
      <div
        class="bg-slate-900/70 p-4 rounded-xl border border-slate-800
               h-[340px] flex flex-col overflow-hidden"
      >
        <h2 class="text-lg mb-2">Orders by Status</h2>
        <div class="flex-1 min-h-0">
          <BarChart :data="chartOrderStatus" />
        </div>
      </div>

      <!-- Pie: Revenue by Status -->
      <div
        class="bg-slate-900/70 p-4 rounded-xl border border-slate-800
               h-[340px] flex flex-col overflow-hidden"
      >
        <h2 class="text-lg mb-2">Revenue by Status</h2>
        <div class="flex-1 min-h-0">
          <PieChart :data="chartCustomers" />
        </div>
      </div>

      <!-- Bar: Top Products -->
      <div
        class="bg-slate-900/70 p-4 rounded-xl border border-slate-800
               h-[340px] flex flex-col overflow-hidden"
      >
        <h2 class="text-lg mb-2">Top Products</h2>
        <div class="flex-1 min-h-0">
          <BarChart :data="chartTopProducts" labelKey="name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import LineChart from "../components/charts/LineChart.vue";
import BarChart from "../components/charts/Barchart.vue"; // pastikan sesuai nama file-mu
import PieChart from "../components/charts/PieChart.vue";
import {
  getAnalyticsOverview,
  getAnalyticsRevenue,
  getAnalyticsOrderStatus,
  getAnalyticsCustomers,
  getAnalyticsTopProducts,
} from "../services/AnalyticsService";

/* ================= ICON COMPONENTS ================= */

const IconOrders = {
  render() {
    return h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      class: "w-5 h-5",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      innerHTML: `
        <path d="M7 3h10l2 3v15l-3-2-3 2-3-2-3 2V6z" />
        <path d="M9 9h6M9 13h4" />
      `,
    });
  },
};

const IconRevenue = {
  render() {
    return h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      class: "w-5 h-5",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      innerHTML: `
        <path d="M12 1v22" />
        <path d="M17 5H10.5a3.5 3.5 0 0 0 0 7h3a3.5 3.5 0 0 1 0 7H7" />
      `,
    });
  },
};

const IconCustomers = {
  render() {
    return h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      class: "w-5 h-5",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      innerHTML: `
        <path d="M8 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm8 0a3 3 0 1 0-3-3" />
        <path d="M2 21a6 6 0 0 1 12 0M14 18a4 4 0 0 1 8 3" />
      `,
    });
  },
};

const IconProducts = {
  render() {
    return h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      class: "w-5 h-5",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      innerHTML: `
        <path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5z" />
        <path d="M3 7.5v9L12 21l9-4.5v-9" />
        <path d="M12 12v9" />
      `,
    });
  },
};

/* ================= STATE ================= */

const overviewCards = ref([]);
const chartRevenue = ref([]);
const chartOrderStatus = ref([]);
const chartCustomers = ref([]);
const chartTopProducts = ref([]);

const loading = ref(false);
const error = ref("");

/* ================= FETCH DATA ================= */

onMounted(async () => {
  loading.value = true;
  error.value = "";

  try {
    const [
      overviewRes,
      revenueRes,
      orderStatusRes,
      customersRes,
      topProductsRes,
    ] = await Promise.all([
      getAnalyticsOverview(),
      getAnalyticsRevenue(),
      getAnalyticsOrderStatus(),
      getAnalyticsCustomers(),
      getAnalyticsTopProducts(),
    ]);

    const overview = overviewRes.data || {};

    overviewCards.value = [
      {
        title: "Total Orders",
        icon: IconOrders,
        iconBg: "bg-indigo-500/15 text-indigo-300",
        value: overview.totalOrders ?? 0,
      },
      {
        title: "Total Revenue",
        icon: IconRevenue,
        iconBg: "bg-emerald-500/15 text-emerald-300",
        value:
          "Rp " +
          Number(overview.totalRevenue || 0).toLocaleString("id-ID"),
      },
      {
        title: "Total Customers",
        icon: IconCustomers,
        iconBg: "bg-sky-500/15 text-sky-300",
        value: overview.totalCustomers ?? 0,
      },
      {
        title: "Total Products",
        icon: IconProducts,
        iconBg: "bg-amber-500/15 text-amber-300",
        value: overview.totalProducts ?? 0,
      },
    ];

    chartRevenue.value = revenueRes.data || [];
    chartOrderStatus.value = orderStatusRes.data || [];
    chartCustomers.value = customersRes.data || [];
    chartTopProducts.value = topProductsRes.data || [];
  } catch (err) {
    console.error(err);
    error.value = "Gagal memuat data analytics.";
  } finally {
    loading.value = false;
  }
});
</script>
