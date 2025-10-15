<template>
  <Layout title="Manajemen Makanan">
    <div class="p-4 bg-white rounded shadow">
      <!-- Filter Kategori -->
      <div class="flex items-center justify-end mb-4">
        <div class="w-40">
          <select v-model="selectedCategory" @change="fetchFoods" class="input">
            <option value="">Semua Kategori</option>
            <option v-for="cat in foodCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-4xl animate-spin">⏳</div>
      </div>

      <!-- Tabel Makanan -->
      <div v-else>
        <div v-if="foods.length === 0" class="py-8 text-center text-gray-500">
          Tidak ada data makanan.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="food in foods"
            :key="food.id"
            class="p-4 border rounded-lg shadow-sm"
          >
            <div class="flex items-center gap-4">
              <img
                :src="food.image_url"
                alt="Food"
                class="object-cover w-20 h-20 rounded"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold">{{ food.name }}</h3>
                <p class="text-sm text-gray-600">{{ food.description }}</p>
                <p class="text-sm text-gray-500">
                  Kategori: {{ food.food_category_name }}
                </p>
                <p class="text-sm text-gray-500">
                  Kalori: {{ food.calories }} kcal | Protein:
                  {{ food.protein }}g | Lemak: {{ food.fat }}g | Karbo:
                  {{ food.carbohydrates }}g
                </p>
                <p class="text-sm text-gray-500">
                  Ukuran: {{ food.ukuran_satuan }} {{ food.ukuran_satuan_nama }}
                </p>
                <p class="text-sm text-gray-500">
                  Alergi:
                  {{ (food.allergies || []).join(', ') || 'Tidak ada' }}
                </p>
              </div>
              <button
                @click="goToEdit(food.id)"
                class="px-3 py-1 text-sm text-white bg-teal-500 rounded hover:bg-teal-600"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(food)"
                class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center mt-6">
            <button
              @click="changePage(meta.current_page - 1)"
              :disabled="meta.current_page === 1"
              class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              ← Prev
            </button>
            <span class="px-4 py-1 text-sm text-gray-700">
              Halaman {{ meta.current_page }} dari {{ meta.last_page }}
            </span>
            <button
              @click="changePage(meta.current_page + 1)"
              :disabled="meta.current_page === meta.last_page"
              class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>

  <Modal :show="showDeleteModal" @close="showDeleteModal = false">
    <template #title>Konfirmasi Hapus</template>
    <div class="space-y-4">
      <p>
        Anda akan menghapus makanan
        <strong>{{ foodToDelete?.name }}</strong
        >. Tindakan ini tidak dapat dibatalkan.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Batal
        </button>
        <button
          @click="deleteFood"
          class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Hapus
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from '@/lib/axios';
import Layout from '@/components/admin/Layout.vue';
import Modal from '@/components/Modal.vue';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const foods = ref([]);
const foodCategories = ref([]);
const selectedCategory = ref('');
const meta = ref({
  current_page: 1,
  last_page: 1,
});

// delete modal
const showDeleteModal = ref(false);
const foodToDelete = ref(null);

function confirmDelete(food) {
  foodToDelete.value = food;
  showDeleteModal.value = true;
}

async function deleteFood() {
  if (!foodToDelete.value) return;

  loading.value = true;
  try {
    await axios.delete(`/food/${foodToDelete.value.id}`);
    toast.success(`Makanan "${foodToDelete.value.name}" berhasil dihapus`);
    showDeleteModal.value = false;
    fetchFoods();
  } catch (err) {
    console.error('Gagal hapus makanan:', err);
    toast.error('Gagal menghapus makanan');
  } finally {
    loading.value = false;
  }
}

// Fetch kategori makanan
async function fetchCategories() {
  try {
    const res = await axios.get('/food-category');
    foodCategories.value = res.data.data;
  } catch (err) {
    console.error('Gagal ambil kategori:', err);
  }
}

// Fetch makanan
async function fetchFoods() {
  loading.value = true;
  try {
    const params = {
      page: meta.value.current_page,
      row_per_page: 10,
    };
    if (selectedCategory.value) {
      params.filterByFoodCategoryId = selectedCategory.value;
    }

    const res = await axios.get('/food/all/paginated', { params });
    foods.value = res.data.data.data;
    meta.value = res.data.data.meta;
  } catch (err) {
    console.error('Gagal ambil makanan:', err);
    toast.error('Gagal memuat data makanan');
  } finally {
    loading.value = false;
  }
}

// Ganti halaman
function changePage(page) {
  meta.value.current_page = page;
  fetchFoods();
}

// Navigasi ke edit
function goToEdit(id) {
  router.push(`/admin/food/edit/${id}`);
}

// Lifecycle
onMounted(() => {
  fetchCategories();
  fetchFoods();
});
</script>
