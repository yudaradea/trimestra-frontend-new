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
          @click="modalShow = true"
          class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded"
        >
          Custom
        </button>
      </div>

      <!-- Custom date picker -->
      <Modal :show="modalShow" @close="modalShow = false">
        <h3 class="mb-4 text-lg font-semibold text-center text-gray-700">
          Pilih Tanggal
        </h3>
        <div class="flex flex-col gap-2">
          <div class="flex-grow mb-3 md:mb-0">
            <label
              for="startDate"
              class="block text-sm font-medium text-gray-700"
            >
              Dari Tanggal
            </label>
            <input
              type="date"
              id="startDate"
              v-model="startDate"
              class="w-full px-2 py-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <div class="flex-grow mt-2 mb-4 md:mb-0">
            <label
              for="endDate"
              class="block text-sm font-medium text-gray-700"
            >
              Sampai Tanggal
            </label>
            <input
              type="date"
              id="endDate"
              v-model="endDate"
              class="w-full px-2 py-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <button
            @click="fetchReport"
            class="w-full px-2 py-1 mt-2 font-semibold text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary md:w-auto"
          >
            Tampilkan
          </button>
        </div>
      </Modal>
    </div>

    <!-- Chart -->
    <div v-if="!loading && reportData.length > 0" class="px-4 mt-6">
      <div class="grid grid-cols-4 gap-2 px-4 mt-4 text-sm text-center">
        <div>
          <p class="text-sm font-light text-gray-700">Kcal</p>
          <div class="w-10 h-3 mx-auto mt-1 rounded bg-emerald-500"></div>
        </div>
        <div>
          <p class="text-sm font-light text-gray-700">Protein</p>
          <div class="w-10 h-3 mx-auto mt-1 bg-blue-500 rounded"></div>
        </div>
        <div>
          <p class="text-sm font-light text-gray-700">Carbs</p>
          <div class="w-10 h-3 mx-auto mt-1 rounded bg-amber-500"></div>
        </div>
        <div>
          <p class="text-sm font-light text-gray-700">Fat</p>
          <div class="w-10 h-3 mx-auto mt-1 bg-red-500 rounded"></div>
        </div>
      </div>
      <NutritionChart :report="reportData" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-2xl animate-spin text-primary">⏳</div>
    </div>

    <!-- Detail harian -->
    <div v-if="!loading" class="px-4 py-6 space-y-4">
      <div class="px-4 py-6 space-y-4">
        <div
          v-for="day in reportData"
          :key="day.date"
          class="p-4 transition-all duration-300 border rounded-xl bg-gray-50"
        >
          <!-- Tanggal dan Hari -->
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="text-sm font-semibold text-gray-700">
                {{ formatDay(day.date) }}, {{ formatDate(day.date) }}
              </p>
            </div>
            <button
              @click="toggleDetail(day.date)"
              class="text-sm underline text-primary"
            >
              {{ expanded === day.date ? 'Tutup Detail' : 'Lihat Detail' }}
            </button>
          </div>

          <!-- Detail Nutrisi dengan Animasi -->
          <transition name="fade-slide">
            <div v-if="expanded === day.date" class="mt-2 space-y-4">
              <div
                v-for="nutrient in [
                  'calories',
                  'protein',
                  'carbohydrates',
                  'fat',
                ]"
                :key="nutrient"
              >
                <p class="text-sm font-medium text-gray-700 capitalize">
                  {{ nutrientLabel[nutrient] }}
                </p>
                <div
                  class="w-full h-3 mt-1 overflow-hidden bg-gray-200 rounded-full"
                >
                  <div
                    class="h-full transition-all duration-500 rounded-full"
                    :class="nutrientColor[nutrient]"
                    :style="{ width: getPercentage(day, nutrient) + '%' }"
                  ></div>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  {{ getPercentage(day, nutrient).toFixed(1) }}% •
                  {{ getIntake(day, nutrient) }} /
                  {{ getTarget(day, nutrient) }}
                </p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import {
  format,
  subDays,
  subMonths,
  isAfter,
  isBefore,
  parseISO,
} from 'date-fns';
import api from '@/lib/axios';
import NutritionChart from '@/components/NutritionChart.vue';
import Modal from '@/components/Modal.vue';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { id } from 'date-fns/locale';

const modalShow = ref(false);
const toast = useToast();
const today = new Date();
const expanded = ref(null); // tanggal yang sedang dibuka detailnya

defineProps({
  reportData: Array,
});

const toggleDetail = (date) => {
  expanded.value = expanded.value === date ? null : date;
};

const formatDay = (dateStr) => {
  const date = parseISO(dateStr);
  return format(date, 'EEE', { locale: id }); // contoh: "Kam"
};

const formatDate = (dateStr) => {
  const date = parseISO(dateStr);
  return format(date, 'd MMM', { locale: id }); // contoh: "14 Okt"
};

const nutrientLabel = {
  calories: 'Kcal',
  protein: 'Protein',
  carbohydrates: 'Carbs',
  fat: 'Fat',
};

const nutrientColor = {
  calories: 'bg-emerald-500',
  protein: 'bg-blue-500',
  carbohydrates: 'bg-amber-500',
  fat: 'bg-red-500',
};

const getIntake = (day, key) => {
  return day.summary[`${key}_intake`] ?? 0;
};

const getTarget = (day, key) => {
  return day.target[key] ?? 1;
};

const getPercentage = (day, key) => {
  const intake = getIntake(day, key);
  const target = getTarget(day, key);
  return Math.min((intake / target) * 100, 100);
};

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
  modalShow.value = false;
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
