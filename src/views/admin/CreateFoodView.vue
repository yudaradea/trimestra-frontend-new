<template>
  <Layout title="Tambah Makanan">
    <div class="p-6 bg-white rounded shadow">
      <h2 class="mb-6 text-xl font-semibold">Form Tambah Makanan</h2>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center py-6">
        <div class="text-4xl animate-spin">⏳</div>
      </div>

      <!-- Form -->
      <form
        v-show="!loading"
        @submit.prevent="handleCreateFood"
        class="space-y-6"
      >
        <!-- Gambar -->
        <div>
          <label class="block mb-1 text-sm font-medium"
            >Gambar Makanan (Maksimal 2MB)</label
          >
          <div class="flex items-center gap-4">
            <div class="relative w-24 h-24 group">
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Preview"
                class="object-cover w-24 h-24 border rounded"
              />
              <div
                v-else
                class="flex items-center justify-center w-24 h-24 text-gray-400 bg-gray-100 border rounded"
              >
                <span class="text-xs text-center">Pilih<br />Gambar</span>
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100"
              >
                <span class="text-xs text-white">Ganti<br />Gambar</span>
              </div>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- Nama -->
        <div>
          <label class="block mb-1 text-sm font-medium">Nama</label>
          <input v-model="form.name" type="text" class="input" required />
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="block mb-1 text-sm font-medium">Deskripsi</label>
          <textarea v-model="form.description" class="input" rows="3" />
        </div>

        <!-- Kategori -->
        <div>
          <label class="block mb-1 text-sm font-medium">Kategori</label>
          <select v-model="form.food_category_id" class="input" required>
            <option value="">Pilih Kategori</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Nutrisi -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Kalori (kcal)</label>
            <input
              v-model="form.calories"
              type="number"
              step="any"
              class="input"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Protein (g)</label>
            <input
              v-model="form.protein"
              type="number"
              step="any"
              class="input"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Lemak (g)</label>
            <input v-model="form.fat" type="number" step="any" class="input" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium"
              >Karbohidrat (g)</label
            >
            <input
              v-model="form.carbohydrates"
              type="number"
              step="any"
              class="input"
            />
          </div>
        </div>

        <!-- Ukuran -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Ukuran Satuan</label>
            <input
              v-model="form.ukuran_satuan"
              type="number"
              step="any"
              class="input"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Nama Satuan</label>
            <input
              v-model="form.ukuran_satuan_nama"
              type="text"
              class="input"
            />
          </div>
        </div>

        <!-- Alergi -->
        <div>
          <label class="block mb-1 text-sm font-medium">Alergi Terkait</label>
          <div class="grid grid-cols-2 gap-2 mt-1">
            <div
              v-for="allergy in allergies"
              :key="allergy.name"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :value="allergy.name"
                v-model="form.allergies"
                class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <label class="ml-2 text-sm text-gray-700">{{
                allergy.name
              }}</label>
            </div>
          </div>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="router.back()"
            type="button"
            class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-white bg-teal-500 rounded hover:bg-teal-600 disabled:opacity-50"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan Makanan' }}
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from '@/lib/axios';
import Layout from '@/components/admin/Layout.vue';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const previewImage = ref(null);
const imageFile = ref(null);

const form = ref({
  name: '',
  description: '',
  food_category_id: '',
  calories: '',
  protein: '',
  fat: '',
  carbohydrates: '',
  ukuran_satuan: '',
  ukuran_satuan_nama: 'gram',
  allergies: [], // array of string nama alergi
});

const categories = ref([]);
const allergies = ref([]);

// Fetch kategori makanan
async function fetchCategories() {
  try {
    const res = await axios.get('/food-category');
    categories.value = res.data.data;
  } catch (err) {
    toast.error('Gagal memuat kategori');
  }
}

// Fetch daftar alergi
async function fetchAllergies() {
  try {
    const res = await axios.get('/allergy');
    allergies.value = res.data.data;
  } catch (err) {
    toast.error('Gagal memuat daftar alergi');
  }
}

// Handle file upload
function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImage.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Submit create
async function handleCreateFood() {
  loading.value = true;
  try {
    const formData = new FormData();

    Object.entries(form.value).forEach(([key, val]) => {
      if (key === 'allergies') {
        val.forEach((v) => formData.append('allergies[]', v));
      } else {
        formData.append(key, val);
      }
    });

    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    await axios.post('/food', formData);
    toast.success('Makanan berhasil ditambahkan');
    router.push('/admin/food');
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Gagal menambahkan makanan');
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchCategories();
  fetchAllergies();
});
</script>
