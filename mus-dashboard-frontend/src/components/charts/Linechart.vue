<template>
  <div class="w-full h-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const props = defineProps({
  data: Array,
});

const chartData = computed(() => ({
  labels: props.data.map((d) => d.date),
  datasets: [
    {
      label: "Revenue",
      data: props.data.map((d) => d.revenue),
      borderColor: "#4ade80",       // 💡 WARNA LINE
      backgroundColor: "#4ade80aa", // 💡 WARNA FILL TIPIS
      pointBackgroundColor: "#4ade80",
      borderWidth: 2,
      tension: 0.3,
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
      ticks: {
        color: "#ffffff",
        // format angka revenue biar rapi (pakai pemisah ribuan)
        callback: (value) => {
          if (typeof value !== "number") return value;
          return value.toLocaleString("id-ID");
        },
      },
      beginAtZero: true,
    },
  },
};

</script>
