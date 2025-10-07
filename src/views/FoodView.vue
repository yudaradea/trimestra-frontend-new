<template>
  <div class="max-w-md min-h-screen pb-24 mx-auto bg-white">
    <Header title="Daftar Makanan" showBack />

    <div
      v-if="loading"
      class="flex items-center justify-center min-h-[80vh] py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
    </div>

    <div v-else>
      <!-- Search -->
      <div class="px-4 pt-4">
        <input
          v-model="search"
          @input="resetAndFetch"
          type="text"
          placeholder="Cari makanan..."
          class="w-full px-4 py-2 border rounded"
        />
      </div>

      <!-- Tabs kategori -->
      <!-- Tabs kategori pakai Swiper -->
      <div class="px-4 py-4">
        <Swiper
          :slides-per-view="'auto'"
          :space-between="12"
          class="px-1"
          grabCursor
          mousewheel
        >
          <SwiperSlide
            v-for="cat in categoryTabs"
            :key="cat.id"
            class="!w-auto"
          >
            <button
              @click="selectCategory(cat.id)"
              :class="[
                'px-4 py-2 rounded-full text-sm whitespace-nowrap',
                selectedCategoryId === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              {{ cat.name }}
            </button>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- List makanan -->

      <div class="grid grid-cols-2 gap-4 mx-4">
        <div
          v-for="food in foods"
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

      <!-- jika makanan tidak ada -->
      <div
        v-if="!loading && !foods.length"
        class="flex items-center justify-center py-12"
      >
        <p class="text-sm italic font-semibold text-gray-600">
          Makanan tidak ditemukan
        </p>
      </div>

      <div v-if="hasMore" class="pt-4">
        <button
          @click="loadMore"
          class="w-full py-2 font-medium text-gray-700 bg-gray-100 rounded-lg"
        >
          Load More
        </button>
      </div>

      <!-- Modal Tambah -->
      <Modal :show="showFoodModal" @close="showFoodModal = false">
        <div class="space-y-4">
          <p class="text-lg font-semibold">Asupan {{ selectedFood?.name }}</p>

          <div>
            <label class="block mb-1 text-sm font-medium">Jenis Makan</label>
            <CustomSelect v-model="mealType" :meal-options="mealOptions" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium"
              >Jumlah Asupan (gram)</label
            >
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              class="input"
            />
          </div>

          <p class="text-sm text-gray-600">
            Total kalori:
            <span class="font-semibold text-primary"
              >{{ totalNutrition.calories }} kal</span
            >
          </p>
          <p class="text-sm text-gray-600">
            Protein:
            <span class="font-semibold">{{ totalNutrition.protein }} g</span>
            | Lemak:
            <span class="font-semibold">{{ totalNutrition.fat }} g</span> |
            Karbo:
            <span class="font-semibold"
              >{{ totalNutrition.carbohydrates }} g</span
            >
          </p>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import Modal from '@/components/Modal.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import api from '@/lib/axios';
import { useToast } from 'vue-toastification';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { useFoodFilterStore } from '@/stores/foodFilterStore';
const foodFilter = useFoodFilterStore();

const toast = useToast();

const foods = ref([]);
const categories = ref([]);
const categoryTabs = computed(() => [
  { id: null, name: 'Semua' },
  ...categories.value,
]);
const selectedCategoryId = ref(foodFilter.selectedCategoryId || null);
const search = ref('');
const page = ref(1);
const rowPerPage = ref(10);
const hasMore = ref(false);
const loading = ref(true);
const isFetching = ref(false);

const showFoodModal = ref(false);
const selectedFood = ref(null);
const quantity = ref(1);
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

const mealOptions = [
  { label: 'Sarapan', value: 'breakfast' },
  { label: 'Makan Siang', value: 'lunch' },
  { label: 'Makan Malam', value: 'dinner' },
  { label: 'Camilan', value: 'snack' },
];

const totalNutrition = computed(() => {
  if (!selectedFood.value || !quantity.value)
    return { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };

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

const fetchFoods = async (append = false) => {
  if (isFetching.value) return;
  isFetching.value = true;
  try {
    const params = {
      search: search.value || '',
      row_per_page: rowPerPage.value,
      page: page.value,
      filterByFoodCategoryId: selectedCategoryId.value || '',
    };

    const { data } = await api.get('/food/all/paginated', { params });
    const items = data.data.data;
    if (append) {
      foods.value = [...foods.value, ...data.data.data];
    } else {
      foods.value = items;
    }

    const pagination = data.data.meta;
    hasMore.value = pagination.current_page < pagination.last_page;
  } catch (err) {
    toast.error('Gagal memuat makanan');
    console.error(err);
  } finally {
    isFetching.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const { data } = await api.get('/food-category');
    categories.value = data.data;
  } catch (err) {
    toast.error('Gagal memuat kategori');
  }
};

const resetAndFetch = () => {
  page.value = 1;
  fetchFoods();
};

const loadMore = () => {
  page.value++;
  fetchFoods();
};

const selectCategory = (id) => {
  selectedCategoryId.value = id;
  page.value = 1;
  fetchFoods();
};

const openFoodModal = (food) => {
  selectedFood.value = food;
  quantity.value = 1;
  mealType.value = 'lunch';
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

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchFoods(), fetchCategories()]);
  } finally {
    loading.value = false;
  }
});
</script>
