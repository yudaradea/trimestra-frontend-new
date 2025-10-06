<template>
  <div class="max-w-md min-h-screen pb-20 mx-auto bg-white">
    <Header title="Diary" showBack />

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-screen py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat data...</span>
    </div>

    <!-- Content -->
    <div v-else class="px-4 py-6 space-y-6">
      <!-- Ringkasan Kalori -->
      <div class="flex items-center justify-between">
        <!-- Taken -->
        <div
          class="flex flex-col items-center flex-1 px-3 py-2 rounded-lg bg-blue-50"
        >
          <span class="text-xs text-gray-500">Taken</span>
          <span class="text-sm font-semibold text-blue-600">
            {{ diary.summary.calories_intake }} Kcal
          </span>
        </div>

        <!-- Lingkaran Progress -->
        <div class="relative flex flex-col items-center w-32 h-32">
          <svg class="w-full h-full" viewBox="0 0 36 36">
            <path
              class="text-gray-200"
              stroke-width="3"
              stroke="currentColor"
              fill="none"
              d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
            />
            <path
              class="text-primary"
              stroke-width="3"
              stroke-linecap="round"
              stroke="currentColor"
              fill="none"
              :stroke-dasharray="`${diary.percentage.calories}, 100`"
              d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
            />
          </svg>
          <div
            class="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <span class="text-2xl font-bold text-gray-800">
              {{ diary.target.calories }}
            </span>
            <span class="text-xs text-gray-500">Kcal</span>
          </div>
        </div>

        <!-- Burnt -->
        <div
          class="flex flex-col items-center flex-1 px-3 py-2 rounded-lg bg-red-50"
        >
          <span class="text-xs text-gray-500">Burnt</span>
          <span class="text-sm font-semibold text-red-600">
            {{ diary.summary.calories_burned }} Kcal
          </span>
        </div>
      </div>

      <!-- Nutrisi -->
      <div class="mt-6 space-y-3">
        <div v-for="nutrient in nutrients" :key="nutrient.key">
          <div class="flex justify-between text-sm">
            <span>{{ nutrient.label }}</span>
            <span>
              {{ diary.summary[nutrient.intake] }}/{{
                diary.target[nutrient.key]
              }}
              {{ nutrient.unit }}
            </span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 rounded-full bg-primary"
              :style="{ width: diary.percentage[nutrient.key] + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Navigasi Tanggal -->
      <div class="flex items-center justify-between">
        <button
          @click="prevDate"
          class="px-3 py-1 text-sm bg-gray-100 rounded-lg"
        >
          ← {{ prevLabel }}
        </button>
        <span class="font-medium">{{ formattedDate }}</span>
        <button
          @click="nextDate"
          class="px-3 py-1 text-sm bg-gray-100 rounded-lg"
          :disabled="isToday"
        >
          {{ nextLabel }} →
        </button>
      </div>

      <!-- Section Diary -->
      <div class="space-y-4">
        <div
          v-for="section in sections"
          :key="section.key"
          class="p-4 border rounded-xl"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">{{ section.label }}</h3>
            <RouterLink
              v-if="section.key !== 'exercise'"
              :to="{
                name: 'food-select',
                query: { type: typeMap[section.key], date: diaryDate },
              }"
              class="text-sm text-primary"
            >
              + {{ section.label }}
            </RouterLink>
            <RouterLink
              v-else
              :to="{
                name: 'exercise-select',
                query: { date: diaryDate },
              }"
              class="text-sm text-primary"
            >
              + {{ section.label }}
            </RouterLink>
          </div>

          <!-- Jika kosong -->
          <div
            v-if="getItems(section.key).length === 0"
            class="mt-2 text-sm text-gray-400"
          >
            Belum ada catatan
          </div>

          <!-- Jika ada data -->
          <ul v-else class="space-y-2">
            <li
              v-for="item in getItems(section.key)"
              :key="item.id"
              class="flex items-center justify-between p-2 rounded-lg bg-gray-50"
            >
              <div>
                <!-- Untuk food -->
                <template v-if="section.key !== 'exercise'">
                  <p class="font-medium">
                    {{ item.food?.name || item.user_food?.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{
                      (item.food?.calories || item.user_food?.calories) *
                      item.quantity
                    }}
                    kcal ({{ item.quantity }} ×
                    {{
                      item.food?.ukuran_satuan || item.user_food?.ukuran_satuan
                    }}
                    g)
                  </p>
                </template>

                <!-- Untuk exercise -->
                <template v-else>
                  <p class="font-medium">
                    {{ item.exercise?.name || item.user_exercise?.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Durasi: {{ item.duration }} menit •
                    {{ item.calories_burned }} kcal
                  </p>
                </template>
              </div>

              <!-- Tombol hapus -->
              <button
                v-if="section.key !== 'exercise'"
                @click="deleteDiaryItem(item.id)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="text-xl ri-delete-bin-line"></i>
              </button>
              <button
                v-else
                @click="deleteExerciseLog(item.id)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="text-xl ri-delete-bin-line"></i>
              </button>
            </li>
          </ul>

          <!-- Total kalori per section -->
          <div
            v-if="
              getItems(section.key).length > 0 && section.key !== 'exercise'
            "
            class="mt-2 text-sm font-semibold text-right text-gray-700"
          >
            Total kalori masuk:
            {{
              getItems(section.key).reduce(
                (sum, i) =>
                  sum +
                  (i.food?.calories || i.user_food?.calories) * i.quantity,
                0
              )
            }}
            kcal
          </div>

          <div
            v-else-if="
              getItems(section.key).length > 0 && section.key === 'exercise'
            "
            class="mt-2 text-sm font-semibold text-right text-gray-700"
          >
            Total kalori terbakar:
            {{
              getItems(section.key).reduce(
                (sum, i) => sum + i.calories_burned,
                0
              )
            }}
            kcal
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import api from '@/lib/axios';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const loading = ref(true);
const diary = ref(null); // summary dari /diary
const foodDiary = ref([]); // detail makanan dari /food-diary
const currentDate = ref(new Date());

// Nutrisi
const nutrients = [
  {
    key: 'carbohydrates',
    label: 'Carbs',
    intake: 'carbohydrates_intake',
    unit: 'g',
  },
  { key: 'protein', label: 'Protein', intake: 'protein_intake', unit: 'g' },
  { key: 'fat', label: 'Fat', intake: 'fat_intake', unit: 'g' },
];

// Section diary
const sections = [
  { key: 'sarapan', label: 'Sarapan' },
  { key: 'makan_siang', label: 'Makan Siang' },
  { key: 'makan_malam', label: 'Makan Malam' },
  { key: 'camilan', label: 'Camilan' },
  { key: 'exercise', label: 'Exercise' },
];

const typeMap = {
  sarapan: 'breakfast',
  makan_siang: 'lunch',
  makan_malam: 'dinner',
  camilan: 'snack',
};

// Format tanggal tampil
const formattedDate = computed(() =>
  currentDate.value.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
);

// Cek hari ini
const isToday = computed(() => {
  const today = new Date();
  return currentDate.value.toDateString() === today.toDateString();
});

// Label prev/next
const prevLabel = computed(() => {
  const d = new Date(currentDate.value);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('id-ID', { weekday: 'long' });
});

const nextLabel = computed(() => {
  const d = new Date(currentDate.value);
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('id-ID', { weekday: 'long' });
});

// Format YYYY-MM-DD
const formatDate = (date) => {
  const d = date ? (date instanceof Date ? date : new Date(date)) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const diaryDate = computed(() => formatDate(currentDate.value));

// Fetch summary (/diary)
const fetchDiary = async () => {
  loading.value = true;
  try {
    const dateStr = formatDate(currentDate.value);
    const { data } = await api.get(`/diary?date=${dateStr}`);
    diary.value = data;
  } catch (err) {
    toast.error('Gagal memuat diary');
  } finally {
    loading.value = false;
  }
};

// Fetch food diary (/food-diary)
const fetchFoodDiary = async () => {
  try {
    const dateStr = formatDate(currentDate.value);
    const { data } = await api.get(`/food-diary?date=${dateStr}`);
    foodDiary.value = data.data; // array of {id, type, items: []}
  } catch (err) {
    toast.error('Gagal memuat makanan');
  }
};

// Ambil item diary per section
const getItems = (sectionKey) => {
  if (sectionKey === 'exercise') return diary.value?.exercise_log || [];
  const section = foodDiary.value.find((d) => d.type === typeMap[sectionKey]);
  return section ? section.items : [];
};

// Hapus item makanan
const deleteDiaryItem = async (itemId) => {
  if (!confirm('Hapus item ini?')) return;
  try {
    await api.delete(`/food-diary-item/${itemId}`);
    toast.success('Item berhasil dihapus');
    fetchFoodDiary();
    fetchDiary(); // refresh summary juga
  } catch (err) {
    toast.error('Gagal menghapus item');
  }
};

// Hapus exercise item
const deleteExerciseLog = async (id) => {
  if (!confirm('Hapus exercise ini?')) return;
  try {
    await api.delete(`/exercise-log/${id}`);
    toast.success('Exercise berhasil dihapus');
    fetchDiary(); // refresh diary data
  } catch (err) {
    toast.error('Gagal menghapus exercise');
    console.error(err);
  }
};

// Navigasi tanggal
const prevDate = () => {
  const d = new Date(currentDate.value);
  d.setDate(d.getDate() - 1);
  currentDate.value = d;
  fetchDiary();
  fetchFoodDiary();
};

const nextDate = () => {
  if (isToday.value) return;
  const d = new Date(currentDate.value);
  d.setDate(d.getDate() + 1);
  currentDate.value = d;
  fetchDiary();
  fetchFoodDiary();
};

// Load awal
onMounted(() => {
  fetchDiary();
  fetchFoodDiary();
});
</script>
