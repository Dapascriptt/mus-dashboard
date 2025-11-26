<template>
  <div class="w-full h-full">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: Array,
});

// warna sesuai status
const statusColors = {
  pending: "#facc15",   // Kuning
  paid: "#4ade80",      // Hijau
  shipped: "#60a5fa",   // Biru
  cancelled: "#f87171", // Merah
};

const chartData = computed(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      data: props.data.map((d) => d.value),
      backgroundColor: props.data.map(
        (d) => statusColors[d.label] || "#9CA3AF" // default abu"
      ),
      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#ffffff" } },
  },
};
</script>
