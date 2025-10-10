<template>
  <div class="max-w-md min-h-screen mx-auto mt-[10px] bg-white">
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

        <!-- Rekomendasi Makanan -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-800">
              Rekomendasi Makanan
            </h2>
            <RouterLink to="/food" class="text-sm text-primary hover:underline"
              >Lihat semua</RouterLink
            >
          </div>

          <div v-if="recommendedLoading" class="flex justify-center py-4">
            <div class="text-xl animate-spin">⏳</div>
          </div>

          <div v-else class="grid grid-cols-2 gap-4">
            <div
              v-for="food in recommendedFoods"
              :key="food.id"
              class="flex flex-col p-3 transition border shadow-sm rounded-xl hover-shadow-md"
            >
              <img
                :src="food.image_url"
                alt="food"
                class="object-cover w-full h-24 rounded-md"
              />

              <div class="flex flex-col justify-between flex-1 mt-2">
                <h3 class="text-sm font-semibold text-gray-800">
                  {{ food.name }}
                </h3>

                <div class="flex items-center justify-between mt-1 text-xs">
                  <p class="text-gray-500">{{ food.food_category_name }}</p>
                  <p class="text-gray-600">🔥 {{ food.calories }} kal</p>
                </div>
              </div>

              <button
                @click="openFoodModal(food)"
                class="w-full py-1 mt-4 text-sm text-white rounded bg-primary hover-bg-primary/80"
              >
                Tambahkan ke Diary
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <Modal :show="showFoodModal" @close="showFoodModal = false">
      <div class="space-y-4">
        <p class="text-lg font-semibold">Asupan {{ selectedFood?.name }}</p>
        <!-- Pilih Tipe Makan -->
        <div>
          <label class="block mb-1 text-sm font-medium">Jenis Makan</label>

          <CustomSelect v-model="mealType" :meal-options="mealOptions" />
        </div>

        <!-- Input Quantity -->
        <div>
          <label class="block mb-1 text-sm font-medium"
            >Jumlah Asupan (porsi)</label
          >
          <input
            type="number"
            v-model.number="quantity"
            min="1"
            class="input"
          />
        </div>

        <!-- Kalori -->
        <p class="text-sm text-gray-600">
          Total kalori:
          <span class="font-semibold text-primary"
            >{{ totalNutrition.calories }} kal</span
          >
        </p>
        <p class="text-sm text-gray-600">
          Protein:
          <span class="font-semibold">{{ totalNutrition.protein }} g</span> |
          Lemak: <span class="font-semibold">{{ totalNutrition.fat }} g</span> |
          Karbo:
          <span class="font-semibold"
            >{{ totalNutrition.carbohydrates }} g</span
          >
        </p>

        <!-- Tombol -->
        <button
          @click="addFoodToDiary"
          class="w-full py-2 mt-2 text-white rounded bg-primary hover:bg-primary/80"
          :disabled="quantity.length === 0"
          :class="{
            'opacity-50 cursor-not-allowed': quantity.length === 0,
          }"
        >
          Tambahkan ke Diary
        </button>
      </div>
    </Modal>

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
import Modal from '@/components/Modal.vue';
import CustomSelect from '@/components/CustomSelect.vue';

const auth = useAuthStore();
const userName = computed(() => auth.getUserName);
const toast = useToast();
const categories = ref([]);
const percentage = ref(0);
const initialLoading = ref(true);
const categoriesLoading = ref(false);

const recommendedFoods = ref([]);
const recommendedLoading = ref(false);
const showFoodModal = ref(false);
const selectedFood = ref(null);
const quantity = ref(1);
const mealOptions = [
  { label: 'Sarapan', value: 'breakfast' },
  { label: 'Makan Siang', value: 'lunch' },
  { label: 'Makan Malam', value: 'dinner' },
  { label: 'Camilan', value: 'snack' },
];

const mealType = ref('lunch');

const currentDate = ref(new Date());
const formatDate = (date) => {
  const d = date ? (date instanceof Date ? date : new Date(date)) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const diaryDate = computed(() => formatDate(currentDate.value));

const fetchRecommendedFoods = async () => {
  recommendedLoading.value = true;
  try {
    const { data } = await api.get('/food-recomended');
    recommendedFoods.value = data.data;
  } catch (err) {
    console.error('Failed to fetch recommended foods:', err);
    toast.error('Gagal memuat rekomendasi makanan');
  } finally {
    recommendedLoading.value = false;
  }
};

const openFoodModal = (food) => {
  selectedFood.value = food;
  quantity.value = quantity.value || 1;
  showFoodModal.value = true;
};

const addFoodToDiary = async () => {
  try {
    await api.post('/food-diary', {
      date: diaryDate.value,
      type: mealType.value,
      items: [
        {
          food_id: selectedFood.value.id,
          quantity: quantity.value,
        },
      ],
    });
    toast.success('Makanan berhasil ditambahkan ke diary!');
    showFoodModal.value = false;
  } catch (err) {
    toast.error('Gagal menambahkan makanan');
  }
};

const totalNutrition = computed(() => {
  if (!selectedFood.value || !quantity.value) {
    return {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
    };
  }

  return {
    calories: Math.round(selectedFood.value.calories * quantity.value),
    protein: parseFloat(
      (selectedFood.value.protein * quantity.value).toFixed(2)
    ),
    fat: parseFloat((selectedFood.value.fat * quantity.value).toFixed(2)),
    carbohydrates: parseFloat(
      (selectedFood.value.carbohydrates * quantity.value).toFixed(2)
    ),
  };
});

const fetchDailyProgress = async () => {
  try {
    const { data } = await api.get('/diary');
    percentage.value = data.percentage.calories;
    // jika data percentage minus, set ke 0
    if (percentage.value < 0) percentage.value = 0;

    // jika data percentage lebih dari 100, set ke 100
    if (percentage.value > 100) percentage.value = 100;
  } catch (err) {
    console.error('Failed to fetch daily progress:', err);
    console.error(err);
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

onMounted(async () => {
  try {
    await Promise.all([
      fetchDailyProgress(),
      fetchCategories(),
      fetchRecommendedFoods(),
    ]);
  } catch (error) {
    console.error('Failed to load initial data:', error);
  } finally {
    initialLoading.value = false;
  }
});

const connectDevice = () => toast.info('Fitur sync alat segera hadir!');
</script>
