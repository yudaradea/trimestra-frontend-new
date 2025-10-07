<template>
  <div class="max-w-md min-h-screen pb-16 mx-auto bg-white">
    <Header title="Latihan" showBack />

    <!-- Loading State -->
    <div
      v-if="initialLoading"
      class="flex flex-col items-center justify-center min-h-screen py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat latihan...</span>
    </div>

    <!-- Content -->
    <div v-else class="px-4 py-6 space-y-6">
      <!-- Intro -->
      <div class="text-sm text-center text-gray-700">
        Pilih jenis latihan yang kamu suka dan mulai bergerak 💪
      </div>

      <!-- Search -->
      <input
        v-model="search"
        @input="resetAndFetch"
        type="text"
        placeholder="Cari latihan..."
        class="input"
      />

      <!-- Tabs Filter -->
      <div class="flex justify-between text-sm font-medium text-gray-600">
        <button
          v-for="jenis in jenisList"
          :key="jenis.value"
          @click="selectJenis(jenis.value)"
          :class="[
            'px-3 py-2 rounded-full',
            selectedJenis === jenis.value
              ? 'bg-primary text-white'
              : 'bg-gray-100',
          ]"
        >
          {{ jenis.label }}
        </button>
      </div>

      <!-- Exercise Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="item in exercises"
          :key="item.id"
          class="p-3 transition border shadow-sm rounded-xl hover:shadow-md"
        >
          <h3 class="text-sm font-semibold text-gray-800">{{ item.name }}</h3>
          <p class="text-xs text-gray-600">
            🔥 {{ item.calories_burned_per_minute }} kal/menit
          </p>
          <p class="text-[11px] italic text-gray-500">
            Jenis: {{ item.jenis }}
          </p>
          <RouterLink
            :to="`/exercise/${item.id}`"
            class="inline-block mt-1 text-xs text-primary hover:underline"
          >
            Lihat Detail
          </RouterLink>
        </div>
      </div>

      <!-- No Result -->
      <div
        v-if="exercises.length === 0"
        class="p-4 text-sm text-center text-gray-600"
      >
        Tidak ada latihan yang cocok dengan pencarianmu.
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="pt-4">
        <button
          @click="loadMore"
          class="w-full py-2 font-medium text-gray-700 bg-gray-100 rounded-lg"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
  <BottomNav />
</template>

<script setup>
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { onMounted, ref, watch } from 'vue';
import api from '@/lib/axios';

const initialLoading = ref(true);
const exercises = ref([]);
const selectedJenis = ref('');
const search = ref('');
const page = ref(1);
const row_per_page = ref(6);
const hasMore = ref(false);
const isFetching = ref(false);

const jenisList = [
  { label: 'Semua', value: '' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Strength', value: 'strength' },
  { label: 'Flexibility', value: 'flexibility' },
];

let debounceTimer;

watch(search, (newVal) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (newVal === '') {
      // Pastikan kosong benar-benar stabil
      resetAndFetch();
    } else if (newVal.length >= 2) {
      // Hindari trigger saat user baru mulai ngetik
      resetAndFetch();
    }
  }, 400);
});

const selectJenis = (value) => {
  selectedJenis.value = value;
  resetAndFetch();
};

const loadMore = () => {
  page.value++;
  fetchExercises(true);
};

const resetAndFetch = () => {
  page.value = 1;
  fetchExercises();
};

const fetchExercises = async (append = false) => {
  if (isFetching.value) return;
  isFetching.value = true;
  try {
    const params = {
      search: search.value || null,
      row_per_page: row_per_page.value,
      jenis: selectedJenis.value,
      page: page.value,
    };

    const res = await api.get('/exercise/all/paginated', { params });
    const items = res.data.data.data || res.data.data;

    if (append) {
      exercises.value = [...exercises.value, ...items];
    } else {
      exercises.value = items;
    }

    const pagination = res.data.data;
    hasMore.value = pagination.meta.current_page < pagination.meta.last_page;
  } catch (err) {
    console.error(err);
  } finally {
    isFetching.value = false;
  }
};

onMounted(async () => {
  initialLoading.value = true;
  try {
    await fetchExercises();
  } finally {
    initialLoading.value = false;
  }
});
</script>
