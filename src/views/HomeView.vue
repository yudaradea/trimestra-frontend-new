<template>
  <div class="max-w-md min-h-screen pb-20 mx-auto bg-white">
    <Header />

    <!-- Loading State -->
    <div
      v-if="initialLoading"
      class="flex flex-col items-center justify-center min-h-screen py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat data...</span>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Bagian Judul -->
      <div
        class="px-4 mb-4 text-center"
        v-if="percentage > 0 && percentage < 100"
      >
        <h1 class="text-xl font-semibold text-primary text-[24px]">
          Halo, {{ userName }}
        </h1>
        <p class="text-sm text-textSecondary text-[16px]">
          Kamu sudah mencapai
          <br />
          <span class="text-primary">{{ percentage }}%</span> target harian!
          Tetap lanjutkan!
        </p>
      </div>

      <div class="px-4 mb-4 text-center" v-else-if="percentage == 0">
        <h1 class="text-xl font-semibold text-primary text-[24px]">
          Halo, {{ userName }}
        </h1>
        <p class="text-sm text-textSecondary text-[16px]">
          Target harian kamu masih
          <br />
          <span class="text-primary">{{ percentage }}%</span> segera catat
          setiap asupan
        </p>
      </div>

      <div class="px-4 mb-4 text-center" v-else-if="percentage >= 100">
        <h1 class="text-xl font-semibold text-primary text-[24px]">
          Halo, {{ userName }}
        </h1>
        <p class="text-sm text-textSecondary text-[16px]">
          Target harian kamu sudah
          <br />
          <span class="text-primary">{{ percentage }}%</span> keren! tetap
          pertahankan di hari hari berikutnya
        </p>
      </div>

      <!-- Progress Card -->
      <div class="px-4">
        <div
          class="flex items-center justify-between p-4 bg-white shadow rounded-2xl"
        >
          <div>
            <h2 class="text-base font-semibold text-gray-800">
              Kemajuan Harian
            </h2>
            <p class="text-sm text-gray-500">Progress target nutrisi</p>
            <span>
              <RouterLink to="/diary" class="text-sm text-primary"
                >Lihat detail</RouterLink
              >
            </span>
          </div>
          <div class="relative w-16 h-16">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path
                class="text-gray-200"
                stroke-width="3"
                stroke="currentColor"
                fill="none"
                d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
              />
              <path
                class="text-teal-500"
                stroke-width="3"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                :stroke-dasharray="`${percentage}, 100`"
                d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
              />
            </svg>
            <div
              class="absolute inset-0 flex items-center justify-center text-sm font-semibold text-teal-600"
            >
              {{ percentage }}%
            </div>
          </div>
        </div>
      </div>

      <main class="px-4 py-4 space-y-6">
        <SliderBanner />

        <!-- Monitor Aktivitas -->
        <div
          class="w-full px-4 md:px-10 py-6 bg-gradient-to-r from-[#399F96] to-[#3CAEA3]/70 rounded-[32px]"
        >
          <div class="flex items-center justify-between">
            <!-- Teks Kiri -->
            <div class="text-white">
              <h3 class="text-base font-semibold leading-tight">Monitor</h3>
              <h3 class="text-base font-semibold leading-tight">
                Aktivitas Sehat
              </h3>
            </div>

            <!-- Tombol Kanan -->
            <button
              @click="connectDevice"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 transition-colors bg-white rounded-full hover:bg-gray-50"
            >
              Hubungkan
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading Categories -->
        <div v-if="categoriesLoading" class="flex justify-center py-8">
          <div class="text-2xl animate-spin">⏳</div>
        </div>

        <!-- Categories -->
        <FavoriteCategory v-else :categories="categories" />
      </main>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import SliderBanner from '@/components/SliderBanner.vue';
import FavoriteCategory from '@/components/FavoriteCategory.vue';
import BottomNav from '@/components/BottomNav.vue';
import api from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Header from '@/components/Header.vue';

const auth = useAuthStore();
const userName = computed(() => auth.getUserName);
const toast = useToast();
const categories = ref([]);
const percentage = ref(0);
const initialLoading = ref(true);
const categoriesLoading = ref(false);

onMounted(async () => {
  try {
    await Promise.all([fetchDailyProgress(), fetchCategories()]);
  } catch (error) {
    console.error('Failed to load initial data:', error);
  } finally {
    initialLoading.value = false;
  }
});

const fetchDailyProgress = async () => {
  try {
    const { data } = await api.get('/diary');
    percentage.value = data.percentage.calories;
    console.log('Percentage:', percentage.value);
  } catch (err) {
    console.error('Failed to fetch daily progress:', err);
    // Set default value jika gagal
    percentage.value = 0;
  }
};

const fetchCategories = async () => {
  categoriesLoading.value = true;
  try {
    const { data } = await api.get('/food-category');
    categories.value = data.data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    toast.error('Gagal memuat kategori');
  } finally {
    categoriesLoading.value = false;
  }
};

const connectDevice = () => toast.info('Fitur sync alat segera hadir!');
</script>
