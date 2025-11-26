<template>
  <div class="w-full h-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  data: Array,
  labelKey: { type: String, default: "name" },
});

// mapping warna (dipakai untuk Orders by Status)
// untuk Top Products yang labelnya nama produk -> jatuh ke warna default
const statusColors = {
  pending: "#facc15aa",   // kuning
  paid: "#4ade80aa",      // hijau
  shipped: "#60a5faaa",   // biru
  cancelled: "#f87171aa", // merah
};

const chartData = computed(() => ({
  labels: props.data.map((d) => d[props.labelKey]),
  datasets: [
    {
      label: "Count",
      data: props.data.map((d) => d.count),
      backgroundColor: props.data.map(
        (d) => statusColors[d[props.labelKey]] || "#3b82f6aa" // default biru
      ),
      borderColor: props.data.map(
        (d) => statusColors[d[props.labelKey]]?.replace("aa", "") || "#60a5fa"
      ),
      borderWidth: 1,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#ffffff" } },
  },
  scales: {
    x: {
      ticks: { color: "#ffffff" },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#ffffff",
        stepSize: 1,
        precision: 0,
        callback: (value) => (Number.isInteger(value) ? value : null),
      },
    },
  },
};
</script>

