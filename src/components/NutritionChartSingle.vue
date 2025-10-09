<script setup>
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

const props = defineProps({
  day: Object,
});

const intake = [
  props.day.summary.calories_intake,
  props.day.summary.protein_intake,
  props.day.summary.carbohydrates_intake,
  props.day.summary.fat_intake,
];

const target = [
  props.day.target.calories,
  props.day.target.protein,
  props.day.target.carbohydrates,
  props.day.target.fat,
];

const chartData = {
  labels: ['Kalori', 'Protein', 'Karbo', 'Lemak'],
  datasets: [
    {
      label: 'Target',
      data: target,
      backgroundColor: '#e5e7eb', // gray-200
    },
    {
      label: 'Intake',
      data: intake,
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
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
  <div class="w-full h-[200px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
