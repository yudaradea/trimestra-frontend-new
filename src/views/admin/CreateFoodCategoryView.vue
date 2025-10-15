<template>
  <Layout title="Tambah Kategori Makanan">
    <div class="p-6 bg-white rounded shadow">
      <h2 class="mb-6 text-xl font-semibold">Form Tambah Kategori</h2>

      <form @submit.prevent="handleCreateCategory" class="space-y-6">
        <!-- Nama Kategori -->
        <div>
          <label class="block mb-1 text-sm font-medium">Nama Kategori</label>
          <input v-model="form.name" type="text" class="input" required />
        </div>

        <!-- Urutan Tampil -->
        <div>
          <label class="block mb-1 text-sm font-medium">Urutan Tampil</label>
          <input
            v-model="form.order"
            type="number"
            class="input"
            placeholder="Contoh: 1"
          />
        </div>

        <!-- Upload Icon -->
        <div class="">
          <label class="block mb-1 text-sm font-medium">Icon Kategori</label>
          <div class="flex items-center gap-4">
            <div class="relative w-24 h-24 group">
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Preview"
                class="object-cover w-24 h-24 border-2 border-gray-300 rounded-full"
              />
              <div
                v-else
                class="flex items-center justify-center w-24 h-24 text-gray-400 bg-gray-100 border-2 border-gray-300 rounded-full"
              >
                <span class="text-xs text-center">Pilih<br />Gambar</span>
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100"
              >
                <span class="text-xs text-center text-white"
                  >Ganti<br />Icon</span
                >
              </div>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p class="text-xs text-gray-500">
              Klik untuk memilih icon kategori
            </p>
          </div>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="router.back()"
            type="button"
            class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import axios from '@/lib/axios';
import Layout from '@/components/admin/Layout.vue';

const toast = useToast();
const router = useRouter();

const loading = ref(false);
const previewImage = ref(null);
const iconFile = ref(null);

// Form state
const form = ref({
  name: '',
  order: '',
});

// Handle file upload
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    iconFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Submit form
async function handleCreateCategory() {
  loading.value = true;

  try {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('order', form.value.order || 0);
    if (iconFile.value) {
      formData.append('icon', iconFile.value);
    }

    await axios.post('/food-category', formData);

    toast.success('Kategori makanan berhasil ditambahkan!');
    router.push('/admin/food-category');
  } catch (error) {
    console.error('Create error:', error);
    toast.error(error.response?.data?.message || 'Gagal menambahkan kategori');
  } finally {
    loading.value = false;
  }
}
</script>
