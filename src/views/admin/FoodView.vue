<template>
  <Layout title="Manajemen Makanan">
    <!-- Header Halaman -->
    <div
      class="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Manajemen Makanan</h1>
        <p class="mt-1 text-sm text-gray-500">
          Kelola daftar makanan, nutrisi, dan kategori.
        </p>
      </div>
      <RouterLink
        to="/admin/food/create"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        <!-- Ikon Plus (Heroicons) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
          />
        </svg>
        Tambah Makanan Baru
      </RouterLink>
    </div>

    <!-- Filter dan Search Bar -->
    <div class="p-4 mb-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="flex flex-col items-center gap-4 md:flex-row">
        <!-- Search dengan Ikon -->
        <div class="relative flex-1 w-full">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <!-- Ikon Search (Heroicons) -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5 text-gray-400"
            >
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            v-model="search"
            @input="fetchFoods"
            type="text"
            placeholder="Cari nama makanan..."
            class="w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <!-- Filter Kategori -->
        <div class="w-full md:w-48">
          <select
            v-model="selectedCategory"
            @change="fetchFoods"
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            <option value="">Semua Kategori</option>
            <option v-for="cat in foodCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Konten Utama (Loading, Empty, List) -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center p-16">
        <!-- Ikon Spinner (Heroicons) -->
        <svg
          class="w-12 h-12 text-teal-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && foods.length === 0"
        class="flex flex-col items-center justify-center p-16 text-center"
      >
        <!-- Ikon Empty (Heroicons) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16 text-gray-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
        <h3 class="mt-3 text-lg font-semibold text-gray-800">
          Tidak Ada Makanan Ditemukan
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Coba ubah filter pencarian Anda atau tambahkan makanan baru.
        </p>
      </div>

      <!-- Daftar Makanan -->
      <div v-else>
        <ul role="list" class="divide-y divide-gray-200">
          <li
            v-for="food in foods"
            :key="food.id"
            class="flex flex-col items-start gap-4 p-4 sm:flex-row sm:p-6"
          >
            <img
              :src="food.image_url"
              alt="Food"
              class="flex-shrink-0 object-fill h-24 rounded-md w-28"
              @error="
                $event.target.src =
                  'https://placehold.co/112x112/e2e8f0/94a3b8?text=Image+Not+Found'
              "
            />

            <div class="flex-1">
              <div
                class="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between"
              >
                <h3 class="text-xl font-bold text-gray-900">{{ food.name }}</h3>
                <span
                  class="mt-1 inline-block rounded-full bg-teal-100 px-3 py-0.5 text-xs font-medium text-teal-800 sm:mt-0"
                >
                  {{ food.food_category_name }}
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ food.description }}</p>

              <!-- Info Nutrisi -->
              <div
                class="flex flex-wrap mt-3 text-sm text-gray-700 gap-x-4 gap-y-2"
              >
                <span
                  >🔥 <strong>{{ food.calories }}</strong> kcal</span
                >
                <span
                  >💪 <strong>{{ food.protein }}</strong
                  >g P</span
                >
                <span
                  >🥑 <strong>{{ food.fat }}</strong
                  >g F</span
                >
                <span
                  >🍞 <strong>{{ food.carbohydrates }}</strong
                  >g C</span
                >
              </div>

              <!-- Info Lain -->
              <div class="mt-2 space-y-1 text-sm text-gray-500">
                <p>
                  <strong>Ukuran:</strong> {{ food.ukuran_satuan }}
                  {{ food.ukuran_satuan_nama }}
                </p>
                <p>
                  <strong>Alergi:</strong>
                  {{ (food.allergies || []).join(', ') || 'Tidak ada' }}
                </p>
              </div>
            </div>

            <!-- Tombol Aksi -->
            <div
              class="flex flex-shrink-0 w-full gap-3 mt-4 sm:mt-0 sm:w-auto sm:flex-col"
            >
              <button
                @click="goToEdit(food.id)"
                class="inline-flex items-center justify-center w-1/2 gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-all bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-full"
              >
                <!-- Ikon Edit (Heroicons) -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
                Edit
              </button>
              <button
                @click="confirmDelete(food)"
                class="inline-flex items-center justify-center w-1/2 gap-2 px-3 py-2 text-sm font-medium text-red-700 transition-all rounded-md shadow-sm bg-red-50 ring-1 ring-inset ring-red-200 hover:bg-red-100 sm:w-full"
              >
                <!-- Ikon Hapus (Heroicons) -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.11-2.368.11a.75.75 0 00-.73.73V5.8c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-.764a.75.75 0 00-.73-.73c-.788 0-1.573-.033-2.368-.11v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.5.66 1.5 1.5V6h-3V5.5A1.5 1.5 0 0110 4zM8.5 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM11.5 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5z"
                    clip-rule="evenodd"
                  />
                  <path
                    d="M1.956 7.362A.75.75 0 013.23 6.75h10.54a.75.75 0 011.274.612l-1.002 7.502A2.25 2.25 0 0111.796 17H5.204a2.25 2.25 0 01-2.244-2.136L1.956 7.362z"
                  />
                </svg>
                Hapus
              </button>
            </div>
          </li>
        </ul>

        <!-- Pagination -->
        <div
          class="flex flex-col items-center justify-between gap-3 px-6 pb-4 mt-6 text-sm sm:flex-row"
        >
          <span class="text-gray-600">
            Halaman <strong>{{ meta.current_page }}</strong> dari
            {{ meta.last_page }}
          </span>
          <div class="flex items-center gap-1">
            <button
              :disabled="meta.current_page === 1"
              @click="changePage(meta.current_page - 1)"
              class="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            <!-- tampilkan halaman yang terlihat -->
            <template v-for="(page, i) in visiblePages" :key="i">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                class="px-3 py-1 rounded"
                :class="
                  page === meta.current_page
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
              >
                {{ page }}
              </button>
              <span v-else class="px-2 text-gray-500 select-none">...</span>
            </template>

            <button
              :disabled="meta.current_page === meta.last_page"
              @click="changePage(meta.current_page + 1)"
              class="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>

  <!-- Modal Konfirmasi Hapus -->
  <Modal :show="showDeleteModal" @close="showDeleteModal = false">
    <template #title>Konfirmasi Hapus Makanan</template>
    <div class="space-y-4">
      <p>
        Apakah Anda yakin ingin menghapus makanan
        <strong>{{ foodToDelete?.name }}</strong
        >? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Batal
        </button>
        <button
          @click="deleteFood"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Ya, Hapus
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from '@/lib/axios';
import Layout from '@/components/admin/Layout.vue';
import Modal from '@/components/Modal.vue';

const visiblePages = computed(() => {
  const total = meta.value.last_page || 1;
  const current = meta.value.current_page || 1;
  const delta = 3; // jumlah halaman di kiri-kanan halaman aktif
  const range = [];

  // batas awal dan akhir
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  // halaman pertama
  range.push(1);

  // tambahkan elipsis sebelum start jika jauh dari 2
  if (start > 2) range.push('...');

  // isi range tengah
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  // tambahkan elipsis sebelum halaman terakhir jika belum dekat
  if (end < total - 1) range.push('...');

  // halaman terakhir (hanya jika total > 1)
  if (total > 1) range.push(total);

  return range;
});

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const foods = ref([]);
const foodCategories = ref([]);
const selectedCategory = ref('');
const search = ref('');
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
      search: search.value,
    };
    if (selectedCategory.value) {
      params.filterByFoodCategoryId = selectedCategory.value;
    }

    const res = await axios.get('/food/all/paginated', { params });
    console.log(res.data);
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
