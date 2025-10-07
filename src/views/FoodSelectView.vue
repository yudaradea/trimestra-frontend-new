<template>
  <div class="max-w-md min-h-screen pb-20 mx-auto bg-white">
    <Header title="Pilih Makanan" showBack />

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat data...</span>
    </div>

    <div v-else>
      <!-- Search -->
      <div class="p-4">
        <input
          v-model="search"
          @input="resetAndFetch"
          type="text"
          placeholder="Cari makanan..."
          class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-primary"
        />
      </div>

      <!-- Asupan Saya -->
      <!-- Asupan Saya -->
      <div class="px-4 mb-4">
        <h3 class="mb-2 font-semibold">Asupan Saya</h3>

        <!-- Jika kosong -->
        <div v-if="userFoods.length === 0" class="text-sm text-gray-500">
          Belum ada makanan custom.
          <button @click="openUserFoodModal" class="ml-1 text-primary">
            + Tambah
          </button>
        </div>

        <!-- Jika ada data -->
        <div v-else class="space-y-2">
          <div
            v-for="food in userFoods"
            :key="food.id"
            class="flex items-center justify-between p-3 border rounded-lg"
          >
            <!-- Checkbox bulat untuk multi-select -->
            <label class="flex items-center flex-1 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedUserFoods"
                :value="food"
                @change="handleFoodSelect(food, true)"
                class="w-5 h-5 mr-3 border-gray-300 rounded-full text-primary focus:ring-primary"
              />
              <div>
                <h4 class="font-medium">{{ food.name }}</h4>
                <p class="text-xs text-gray-500">
                  {{ food.calories }} kcal / {{ food.ukuran_satuan }} g
                </p>
              </div>
            </label>

            <!-- Tombol Edit & Hapus -->
            <div class="flex gap-2 ml-3">
              <button
                @click.stop="editUserFood(food)"
                class="text-xs font-medium text-blue-500"
              >
                Edit
              </button>
              <button
                @click.stop="deleteUserFood(food.id)"
                class="text-xs font-medium text-red-500"
              >
                Hapus
              </button>
            </div>
          </div>

          <!-- Tambah baru -->
          <!-- Load More -->
          <div v-if="hasMoreUserFoods" class="p-4 my-4">
            <button
              @click="loadMoreUserFoods"
              class="w-full py-2 font-medium text-gray-700 bg-gray-100 rounded-lg"
            >
              Load More
            </button>
          </div>
          <button
            @click="openUserFoodModal"
            class="w-full py-2 mt-4 text-white rounded-lg bg-primary"
          >
            + Tambah Makanan Saya
          </button>
        </div>
      </div>

      <!-- Makanan Admin -->
      <div class="p-4">
        <div class="flex mb-3 space-x-2 overflow-x-auto">
          <button
            @click="selectCategory('all')"
            class="px-4 py-2 text-sm rounded-full whitespace-nowrap"
            :class="
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            "
          >
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            class="px-4 py-2 text-sm rounded-full whitespace-nowrap"
            :class="
              selectedCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            "
          >
            {{ cat.name }}
          </button>
        </div>

        <div v-if="foods.length > 0" class="grid gap-2">
          <label
            v-for="food in foods"
            :key="food.id"
            class="flex items-center p-3 border rounded-lg cursor-pointer"
          >
            <input
              type="checkbox"
              v-model="selectedAdminFoods"
              :value="food"
              @change="handleFoodSelect(food, false)"
              class="w-5 h-5 mr-3 border-gray-300 rounded-full text-primary focus:ring-primary"
            />
            <div>
              <h4 class="font-medium">{{ food.name }}</h4>
              <p class="text-xs text-gray-500">
                {{ food.calories }} kcal / {{ food.ukuran_satuan }}
                {{ food.ukuran_satuan_nama }}
              </p>
            </div>
          </label>
        </div>
        <!-- Load More -->
        <div v-if="hasMore" class="p-4">
          <button
            @click="loadMore"
            class="w-full py-2 font-medium text-gray-700 bg-gray-100 rounded-lg"
          >
            Load More
          </button>
        </div>
      </div>

      <!-- list selected -->

      <div v-if="selectedFoodsPreview.length > 0" class="p-4 space-y-4">
        <h3 class="text-lg font-semibold">Makanan yang akan ditambahkan</h3>

        <div
          v-for="item in selectedFoodsPreview"
          :key="item.id + '-' + item.isUserFood"
          class="p-3 space-y-1 border rounded-lg"
        >
          <div class="grid items-center grid-cols-12">
            <div class="col-span-11">
              <h4 class="font-medium">{{ item.name }}</h4>
              <p class="text-xs text-gray-500">
                {{ item.quantity }} porsi — {{ item.calories.toFixed(1) }} kcal,
                {{ item.protein.toFixed(1) }}g protein,
                {{ item.fat.toFixed(1) }}g lemak,
                {{ item.carbohydrates.toFixed(1) }}g karbo
              </p>

              <div class="mt-2">
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  @change="updateQuantity(item)"
                  class="w-12 px-2 py-1 text-sm border rounded"
                />
                <span class="ml-2 text-xs text-gray-500">Edit porsi</span>
              </div>
            </div>

            <button
              @click="removeSelectedFood(item)"
              class="col-span-1 text-sm text-red-500 hover:underline"
            >
              <i class="text-xl ri-delete-bin-line"></i>
            </button>
          </div>
        </div>

        <div class="pt-2 border-t">
          <p class="text-sm font-medium">
            Total: {{ totalNutrition.calories.toFixed(1) }} kcal,
            {{ totalNutrition.protein.toFixed(1) }}g protein,
            {{ totalNutrition.fat.toFixed(1) }}g lemak,
            {{ totalNutrition.carbohydrates.toFixed(1) }}g karbo
          </p>
        </div>
      </div>

      <!-- Tombol Submit -->
      <div class="p-4">
        <button
          @click="submitSelectedFoods"
          class="w-full py-3 text-white rounded-lg bg-primary"
          :disabled="selectedFoodsPreview.length === 0"
          :class="{
            'opacity-50 cursor-not-allowed': selectedFoodsPreview.length === 0,
          }"
        >
          Tambahkan ke Diary
        </button>
      </div>
    </div>

    <!-- Modal Input/Edit User Food -->
    <Modal :show="showUserFoodModal" @close="closeUserFoodModal">
      <h3 class="mb-4 text-lg font-semibold">
        {{ editingFood ? 'Edit Makanan' : 'Tambah Makanan' }}
      </h3>
      <form @submit.prevent="saveUserFood" class="space-y-3">
        <input
          v-model="userFood.name"
          placeholder="Contoh: Nasi Goreng Ayam"
          class="input"
          required
        />
        <input
          v-model.number="userFood.calories"
          type="number"
          placeholder="jumlah kalori"
          class="input"
          required
        />
        <input
          v-model.number="userFood.protein"
          type="number"
          placeholder="Jumlah Protein (g) "
          class="input"
        />
        <input
          v-model.number="userFood.fat"
          type="number"
          placeholder="Jumlah Lemak (g) "
          class="input"
        />
        <input
          v-model.number="userFood.carbohydrates"
          type="number"
          placeholder="Jumlah Karbohidrat (g) "
          class="input"
        />
        <input
          v-model.number="userFood.ukuran_satuan"
          type="number"
          placeholder="ukuran satuan makanan misal 100 gr"
          class="input"
        />
        <button
          type="submit"
          class="w-full py-2 text-white rounded-lg bg-primary"
        >
          Simpan
        </button>
      </form>
    </Modal>

    <Modal :show="showQuantityModal" @close="closeQuantityModal">
      <template #title>Jumlah Porsi</template>
      <div class="space-y-4">
        <p class="text-gray-700">
          Berapa banyak porsi untuk <strong>{{ selectedFood?.name }}</strong
          >?
        </p>
        <input type="number" v-model="quantity" min="1" class="input" />
        <div class="text-right">
          <button
            @click="confirmQuantitySelection"
            class="px-4 py-2 text-white rounded-lg bg-primary hover:bg-teal-600"
          >
            Tambahkan
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/lib/axios';
import Header from '@/components/Header.vue';
import Modal from '@/components/Modal.vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';

const loading = ref(true);

const toast = useToast();
const route = useRoute();
const router = useRouter();

const search = ref('');
const categories = ref([]);
const selectedCategory = ref('all');
const foods = ref([]);
const page = ref(1);
const row_per_page = ref(10);
const hasMore = ref(false);

// input to diary
const selectedUserFoods = ref([]);
const selectedAdminFoods = ref([]);

// user food (paginated)
const userFoods = ref([]);
const userFoodPage = ref(1);
const userFoodRowPerPage = ref(10);
const hasMoreUserFoods = ref(false);

const showUserFoodModal = ref(false);
const editingFood = ref(null);
const userFood = ref({
  name: '',
  calories: null,
  protein: null,
  fat: null,
  carbohydrates: null,
  ukuran_satuan: null,
});

// quantity modal
const showQuantityModal = ref(false);
const selectedFood = ref(null);
const isUserFood = ref(false);
const quantity = ref(1);

// date & type dari query
const diaryDate = route.query.date;
const diaryType = route.query.type;

const fetchCategories = async () => {
  const { data } = await api.get('/food-category');
  categories.value = data.data;
};

// Admin foods
const fetchFoods = async (append = false) => {
  try {
    const params = {
      search: search.value || null,
      row_per_page: row_per_page.value,
      page: page.value,
    };
    if (selectedCategory.value !== 'all') {
      params.filterByFoodCategoryId = selectedCategory.value;
    }

    const res = await api.get('/food/all/paginated', { params });

    // kalau backend balikin data.data.data
    const items = res.data.data.data || res.data.data;

    if (append) {
      foods.value = [...foods.value, ...items];
    } else {
      foods.value = items;
    }

    // pagination info
    const pagination = res.data.data;

    hasMore.value = pagination.meta.current_page < pagination.meta.last_page;
  } catch (err) {
    toast.error('Gagal memuat makanan');
    console.error(err);
  }
};

// User foods (paginated)
const fetchUserFoods = async (append = false) => {
  try {
    const params = {
      search: search.value || null,
      row_per_page: userFoodRowPerPage.value,
      page: userFoodPage.value,
    };

    const res = await api.get('/user-food/all/paginated', { params });

    const items = res.data.data.data || res.data.data;

    if (append) {
      userFoods.value = [...userFoods.value, ...items];
    } else {
      userFoods.value = items;
    }

    const pagination = res.data.data;
    hasMoreUserFoods.value =
      pagination.meta.current_page < pagination.meta.last_page;
  } catch (err) {
    toast.error('Gagal memuat makanan custom');
  }
};

const selectCategory = (id) => {
  selectedCategory.value = id;
  resetAndFetch();
};

const resetAndFetch = () => {
  page.value = 1;
  userFoodPage.value = 1;
  fetchFoods();
  fetchUserFoods();
};

const loadMore = () => {
  page.value++;
  fetchFoods(true);
};

const loadMoreUserFoods = () => {
  userFoodPage.value++;
  fetchUserFoods(true);
};

// user food modal
const openUserFoodModal = () => {
  editingFood.value = null;
  userFood.value = {
    name: '',
    calories: null,
    protein: null,
    fat: null,
    carbohydrates: null,
    ukuran_satuan: null,
  };
  showUserFoodModal.value = true;
};

const closeUserFoodModal = () => {
  showUserFoodModal.value = false;
};

const editUserFood = (food) => {
  editingFood.value = food.id;
  userFood.value = { ...food };
  showUserFoodModal.value = true;
};

const saveUserFood = async () => {
  try {
    if (editingFood.value) {
      await api.put(`/user-food/${editingFood.value}`, userFood.value);
      toast.success('Makanan berhasil diupdate');
    } else {
      await api.post('/user-food', userFood.value);
      toast.success('Makanan berhasil ditambahkan');
    }
    showUserFoodModal.value = false;
    resetAndFetch();
  } catch (err) {
    toast.error('Gagal menyimpan makanan');
  }
};

const deleteUserFood = async (id) => {
  if (!confirm('Hapus makanan ini?')) return;
  try {
    await api.delete(`/user-food/${id}`);
    toast.success('Makanan berhasil dihapus');
    resetAndFetch();
  } catch (err) {
    toast.error('Gagal menghapus makanan');
  }
};

// quantity modal
const selectedUserFoodQuantities = ref({});
const selectedAdminFoodQuantities = ref({});

const openQuantityModal = (food, fromUser) => {
  selectedFood.value = food;
  isUserFood.value = fromUser;
  quantity.value = 1;
  showQuantityModal.value = true;
};

const handleFoodSelect = (food, fromUser) => {
  const isSelected = fromUser
    ? selectedUserFoods.value.includes(food)
    : selectedAdminFoods.value.includes(food);

  if (isSelected) {
    openQuantityModal(food, fromUser);
  } else {
    // kalau user uncheck, hapus dari quantity map
    const id = food.id;
    if (fromUser) {
      delete selectedUserFoodQuantities.value[id];
    } else {
      delete selectedAdminFoodQuantities.value[id];
    }
  }
};

const closeQuantityModal = () => {
  showQuantityModal.value = false;
};

const confirmQuantitySelection = () => {
  const id = selectedFood.value.id;
  const qty = quantity.value;

  if (isUserFood.value) {
    selectedUserFoodQuantities.value[id] = qty;
  } else {
    selectedAdminFoodQuantities.value[id] = qty;
  }

  showQuantityModal.value = false;
};

// list selected foods
const selectedFoodsPreview = computed(() => {
  const user = selectedUserFoods.value.map((f) => ({
    id: f.id,
    name: f.name,
    calories: f.calories * (selectedUserFoodQuantities.value[f.id] || 1),
    protein: f.protein * (selectedUserFoodQuantities.value[f.id] || 1),
    fat: f.fat * (selectedUserFoodQuantities.value[f.id] || 1),
    carbohydrates:
      f.carbohydrates * (selectedUserFoodQuantities.value[f.id] || 1),
    quantity: selectedUserFoodQuantities.value[f.id] || 1,
    isUserFood: true,
  }));

  const admin = selectedAdminFoods.value.map((f) => ({
    id: f.id,
    name: f.name,
    calories: f.calories * (selectedAdminFoodQuantities.value[f.id] || 1),
    protein: f.protein * (selectedAdminFoodQuantities.value[f.id] || 1),
    fat: f.fat * (selectedAdminFoodQuantities.value[f.id] || 1),
    carbohydrates:
      f.carbohydrates * (selectedAdminFoodQuantities.value[f.id] || 1),
    quantity: selectedAdminFoodQuantities.value[f.id] || 1,
    isUserFood: false,
  }));

  return [...user, ...admin];
});

const totalNutrition = computed(() => {
  return selectedFoodsPreview.value.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.fat += item.fat;
      acc.carbohydrates += item.carbohydrates;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
  );
});

const removeSelectedFood = (item) => {
  if (item.isUserFood) {
    selectedUserFoods.value = selectedUserFoods.value.filter(
      (f) => f.id !== item.id
    );
    delete selectedUserFoodQuantities.value[item.id];
  } else {
    selectedAdminFoods.value = selectedAdminFoods.value.filter(
      (f) => f.id !== item.id
    );
    delete selectedAdminFoodQuantities.value[item.id];
  }
};

const updateQuantity = (item) => {
  const qty = item.quantity;
  if (item.isUserFood) {
    selectedUserFoodQuantities.value[item.id] = qty;
  } else {
    selectedAdminFoodQuantities.value[item.id] = qty;
  }
};

const submitSelectedFoods = async () => {
  if (
    selectedUserFoods.value.length === 0 &&
    selectedAdminFoods.value.length === 0
  ) {
    toast.error('Pilih minimal satu makanan');
    return;
  }

  try {
    const items = [
      ...selectedUserFoods.value.map((f) => ({
        user_food_id: f.id,
        quantity: selectedUserFoodQuantities.value[f.id] || 1,
      })),
      ...selectedAdminFoods.value.map((f) => ({
        food_id: f.id,
        quantity: selectedAdminFoodQuantities.value[f.id] || 1,
      })),
    ];

    await api.post('/food-diary', {
      date: diaryDate,
      type: diaryType,
      items,
    });

    router.push('/diary');
    toast.success('Asupan berhasil ditambahkan');
  } catch (err) {
    toast.error('Gagal menambahkan asupan');
    console.error(err);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchCategories(), fetchFoods(), fetchUserFoods()]);
  } finally {
    loading.value = false;
  }
});
</script>
