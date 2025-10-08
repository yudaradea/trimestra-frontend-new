<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <Header title="Laporan Nutrisi" showBack />

    <!-- Filter -->
    <div class="px-4 pt-4 space-y-2">
      <div class="flex gap-2">
        <button
          @click="setFilter('weekly')"
          :class="
            filterType === 'weekly'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          "
          class="px-3 py-1 text-sm rounded"
        >
          1 Minggu
        </button>
        <button
          @click="setFilter('monthly')"
          :class="
            filterType === 'monthly'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          "
          class="px-3 py-1 text-sm rounded"
        >
          1 Bulan
        </button>
        <button
          @click="filterType = 'custom'"
          class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded"
        >
          Custom
        </button>
      </div>

      <!-- Custom date picker -->
      <div v-if="filterType === 'custom'" class="flex items-center gap-2">
        <input
          type="date"
          v-model="startDate"
          class="px-2 py-1 text-sm border rounded"
        />
        <span class="text-sm">sampai</span>
        <input
          type="date"
          v-model="endDate"
          class="px-2 py-1 text-sm border rounded"
        />
        <button
          @click="fetchReport"
          class="px-3 py-1 text-sm text-white rounded bg-primary"
        >
          Tampilkan
        </button>
      </div>
    </div>

    <!-- Chart -->
    <div v-if="!loading && reportData.length > 0" class="px-4 mt-6">
      <NutritionChart :report="reportData" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-2xl animate-spin text-primary">⏳</div>
    </div>

    <!-- Detail harian -->
    <div v-if="!loading" class="px-4 py-6 space-y-4">
      <div
        v-for="day in reportData"
        :key="day.date"
        class="p-4 border rounded-xl bg-gray-50"
      >
        <h3 class="font-semibold text-gray-800">{{ day.date }}</h3>
        <p class="text-sm text-gray-600">
          Kalori: {{ day.summary.calories_intake }} / {{ day.target.calories }}
        </p>
        <p class="text-sm text-gray-600">
          Protein: {{ day.summary.protein_intake }} / {{ day.target.protein }}
        </p>
        <p class="text-sm text-gray-600">
          Karbo: {{ day.summary.carbohydrates_intake }} /
          {{ day.target.carbohydrates }}
        </p>
        <p class="text-sm text-gray-600">
          Lemak: {{ day.summary.fat_intake }} / {{ day.target.fat }}
        </p>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { format, subDays, subMonths, isAfter, isBefore } from 'date-fns';
import api from '@/lib/axios';
import NutritionChart from '@/components/NutritionChart.vue';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';

const toast = useToast();
const today = new Date();

const filterType = ref('weekly'); // 'weekly', 'monthly', 'custom'
const startDate = ref(subDays(today, 6)); // default 7 hari
const endDate = ref(today);

const reportData = ref([]);
const loading = ref(false);

const formattedStart = computed(() => format(startDate.value, 'yyyy-MM-dd'));
const formattedEnd = computed(() => format(endDate.value, 'yyyy-MM-dd'));

const fetchReport = async () => {
  if (isAfter(startDate.value, endDate.value)) {
    toast.error('Tanggal awal tidak boleh lebih dari tanggal akhir');
    return;
  }
  if (isAfter(endDate.value, today)) {
    toast.error('Tanggal akhir tidak boleh melebihi hari ini');
    return;
  }

  loading.value = true;
  try {
    const { data } = await api.get('/diary/report', {
      params: {
        start_date: formattedStart.value,
        end_date: formattedEnd.value,
      },
    });
    reportData.value = data;
  } catch (err) {
    toast.error('Gagal memuat laporan');
  } finally {
    loading.value = false;
  }
};

const setFilter = (type) => {
  filterType.value = type;
  if (type === 'weekly') {
    startDate.value = subDays(today, 6);
    endDate.value = today;
  } else if (type === 'monthly') {
    startDate.value = subMonths(today, 1);
    endDate.value = today;
  }
  fetchReport();
};

onMounted(() => {
  fetchReport();
});
</script>
