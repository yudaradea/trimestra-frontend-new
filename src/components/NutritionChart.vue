<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Props dari parent
const props = defineProps({
  report: {
    type: Array,
    default: () => [],
  },
});

// Data chart aman dengan fallback
const labels = computed(() => props.report.map((r) => r.date));
const calories = computed(() =>
  props.report.map((r) => r.summary.calories_intake)
);
const protein = computed(() =>
  props.report.map((r) => r.summary.protein_intake)
);
const carbs = computed(() =>
  props.report.map((r) => r.summary.carbohydrates_intake)
);
const fat = computed(() => props.report.map((r) => r.summary.fat_intake));

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Kalori',
      data: calories.value,
      backgroundColor: '#10b981',
    },
    {
      label: 'Protein',
      data: protein.value,
      backgroundColor: '#3b82f6',
    },
    {
      label: 'Karbo',
      data: carbs.value,
      backgroundColor: '#f59e0b',
    },
    {
      label: 'Lemak',
      data: fat.value,
      backgroundColor: '#ef4444',
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'top',
      labels: {
        font: { size: 12 },
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.parsed.y} g`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 25 },
    },
  },
};
</script>

<template>
  <div class="w-full h-[300px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
