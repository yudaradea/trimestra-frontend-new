<template>
  <Layout title="Manajemen Food">
    <div class="p-4 bg-white rounded-lg shadow-sm">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-12"
      >
        <div class="text-4xl animate-spin">⏳</div>
      </div>

      <!-- Table -->
      <FoodCategoryTableView
        v-else
        :foodCategories="foodCategories"
        @edit="confirmEditFoodCategory"
        @delete="confirmDelete"
      />
    </div>

    <!-- Modal Edit -->
    <Modal :show="showEditModal" @close="showEditModal = false">
      <template #title> Ubah Food Category </template>
      <div class="space-y-4">
        <input
          v-model="selectedFoodCategory.name"
          type="text"
          placeholder="Nama"
          class="input"
        />
        <input
          v-model="selectedFoodCategory.order"
          type="number"
          placeholder="Urutan Tampil"
          class="input"
        />

        <!-- Upload Icon -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Icon</label
          >
          <input
            type="file"
            accept="image/*"
            @change="handleIconChange"
            class="input"
          />
          <div v-if="iconPreview" class="mt-2">
            <img
              :src="iconPreview"
              alt="Preview Icon"
              class="object-contain w-16 h-16 border rounded"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            @click="updateFoodCategory"
            class="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal Delete -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <template #title> Konfirmasi Hapus </template>
      <div class="space-y-4">
        <p>
          Anda akan menghapus kategori
          <strong>{{ selectedFoodCategory?.name }}</strong
          >. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            @click="deleteFoodCategory"
            class="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Hapus
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
