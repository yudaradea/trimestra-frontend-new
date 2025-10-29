<template>
  <Layout title="Manajemen Kategori Makanan">
    <!-- Header Halaman -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        Manajemen Kategori Makanan
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Kelola jenis-jenis kategori untuk makanan Anda.
      </p>
    </div>

    <div class="bg-white rounded-3xl">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center p-16"
      >
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
        <p class="mt-3 text-sm font-medium text-gray-600">Memuat data...</p>
      </div>

      <!-- Table (Menggunakan komponen yang sudah diperbarui) -->
      <FoodCategoryTableView
        v-else
        :foodCategories="foodCategories"
        @edit="confirmEditFoodCategory"
        @delete="confirmDelete"
      />
    </div>

    <!-- Modal Edit -->
    <Modal :show="showEditModal" @close="showEditModal = false">
      <template #title>
        <span class="text-xl font-semibold text-teal-700"
          >Ubah Kategori Makanan</span
        >
      </template>
      <div class="p-2 space-y-5">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Nama Kategori</label
          >
          <input
            id="name"
            v-model="selectedFoodCategory.name"
            type="text"
            placeholder="Masukkan nama kategori"
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="order" class="block text-sm font-medium text-gray-700"
            >Urutan Tampil</label
          >
          <input
            id="order"
            v-model="selectedFoodCategory.order"
            type="number"
            placeholder="Urutan tampilan (angka)"
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        <!-- Upload Icon Area -->
        <div class="pt-4 border-t">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Icon Kategori</label
          >
          <input
            type="file"
            accept="image/*"
            @change="handleIconChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />

          <div
            v-if="iconPreview || selectedFoodCategory?.icon_url"
            class="flex items-center gap-4 mt-4"
          >
            <span class="text-sm font-medium text-gray-600">Preview:</span>
            <img
              :src="iconPreview || selectedFoodCategory?.icon_url"
              alt="Preview Icon"
              class="object-contain w-16 h-16 border-2 border-teal-300 rounded-full shadow-md"
              @error="
                $event.target.src =
                  'https://placehold.co/64x64/e2e8f0/94a3b8?text=Icon'
              "
            />
          </div>
          <p v-else class="mt-2 text-xs italic text-gray-500">
            Pilih file gambar baru jika ingin mengubah ikon.
          </p>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Batal
          </button>
          <button
            @click="updateFoodCategory"
            class="px-4 py-2 text-sm font-medium text-white transition-all bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <!-- Ikon Simpan (Save) -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5 inline-block -mt-0.5 mr-1"
            >
              <path
                d="M7.75 4.5c0-.528.428-.977.994-1.011l1.506-.011c.567.034.994.483.994 1.011v.498L17.5 5.006A1.5 1.5 0 0119 6.5v10a1.5 1.5 0 01-1.5 1.5H3.5A1.5 1.5 0 012 16.5v-10A1.5 1.5 0 013.5 5.006l6.25-.008v-.498zM17.5 6.5l-6.25.008V8h7.75V6.5zM3.5 8h4.75v8.5H3.5a.5.5 0 01-.5-.5v-7.5a.5.5 0 01.5-.5zM12 12.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5H12zM12 9.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5H12z"
              />
            </svg>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal Delete -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <template #title>
        <span class="text-xl font-semibold text-red-600">Hapus Kategori</span>
      </template>
      <div class="p-2 space-y-6 text-center">
        <!-- Ikon Peringatan Besar -->
        <div
          class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-6 h-6 text-red-600"
          >
            <path
              fill-rule="evenodd"
              d="M8.485 2.495c.791-1.353 2.653-1.353 3.444 0l4.314 7.351A2.25 2.25 0 0113.5 13.5h-8.228a2.25 2.25 0 01-1.93-3.654l4.313-7.35zM10 14a1 1 0 100 2 1 1 0 000-2z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <p class="text-gray-600">
          Anda akan menghapus kategori
          <strong class="text-red-600">{{ selectedFoodCategory?.name }}</strong
          >.
          <br />
          **Tindakan ini tidak dapat dibatalkan** dan mungkin memengaruhi data
          makanan yang terkait.
        </p>

        <div class="flex justify-center gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Batal
          </button>
          <button
            @click="deleteFoodCategory"
            class="px-4 py-2 text-sm font-medium text-white transition-all bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Ya, Hapus Permanen
          </button>
        </div>
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/lib/axios';
import Layout from '@/components/admin/Layout.vue';
import Modal from '@/components/Modal.vue';
import { useToast } from 'vue-toastification';
import FoodCategoryTableView from '@/components/admin/FoodCategoryTableView.vue';

const toast = useToast();

const loading = ref(true);
const foodCategories = ref([]);

// Modal Edit
const showEditModal = ref(false);
const selectedFoodCategory = ref(null);
const iconFile = ref(null);
const iconPreview = ref(null);

// Modal Delete
const showDeleteModal = ref(false);

// Fetch data
async function fetchFoodsCategories() {
  loading.value = true;
  try {
    const res = await axios.get('/food-category');
    foodCategories.value = res.data.data;
  } catch (err) {
    console.error('Error fetching food categories:', err);
  } finally {
    loading.value = false;
  }
}

// Edit modal open
function confirmEditFoodCategory(foodCategory) {
  selectedFoodCategory.value = { ...foodCategory };
  iconPreview.value = foodCategory.icon_url || null;
  iconFile.value = null;
  showEditModal.value = true;
}

// Handle icon file change
function handleIconChange(event) {
  const file = event.target.files[0];
  if (file) {
    iconFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      iconPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Submit edit
async function updateFoodCategory() {
  try {
    const formData = new FormData();
    formData.append('name', selectedFoodCategory.value.name);
    formData.append('order', selectedFoodCategory.value.order);
    if (iconFile.value) {
      formData.append('icon', iconFile.value);
    }

    await axios.post(
      `/food-category/${selectedFoodCategory.value.id}?_method=PUT`,
      formData
    );

    showEditModal.value = false;
    toast.success('Food category berhasil diubah');
    fetchFoodsCategories();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Gagal mengubah kategori');
  }
}

// Delete modal open
function confirmDelete(foodCategory) {
  selectedFoodCategory.value = foodCategory;
  showDeleteModal.value = true;
}

// Submit delete
async function deleteFoodCategory() {
  try {
    await axios.delete(`/food-category/${selectedFoodCategory.value.id}`);
    showDeleteModal.value = false;
    toast.success('Food category berhasil dihapus');
    fetchFoodsCategories();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Gagal menghapus kategori');
  }
}

// Lifecycle
onMounted(() => {
  fetchFoodsCategories();
});
</script>
