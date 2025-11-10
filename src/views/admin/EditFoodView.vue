<template>
  <Layout title="Edit Makanan">
    <div class="p-6 bg-white rounded shadow">
      <h2 class="mb-6 text-xl font-semibold">Form Edit Makanan</h2>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center py-6">
        <div class="text-4xl animate-spin">⏳</div>
      </div>

      <!-- Form -->
      <form
        v-show="!loading"
        @submit.prevent="handleUpdateFood"
        class="space-y-6"
      >
        <!-- Gambar -->
        <div>
          <label class="block mb-1 text-sm font-medium">Gambar Makanan</label>
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
            <p class="text-xs text-gray-500">Klik untuk mengganti gambar</p>
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
          <select v-model="form.food_category_id" class="input">
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
              :key="allergy.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`allergy-${allergy.id}`"
                :value="allergy.id"
                :checked="selectedAllergies.includes(allergy.id)"
                @change="onAllergyCheckboxChange(allergy.id)"
                class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <label
                :for="`allergy-${allergy.id}`"
                class="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {{ allergy.name }}
              </label>
            </div>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Pilih alergi makanan yang terkait.
          </p>
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
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from '@/lib/axios';
import Layout from '@/components/admin/Layout.vue';

const route = useRoute();
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
  ukuran_satuan_nama: '',
  allergies: [], // Akan diisi saat submit dengan nama alergi
});

const categories = ref([]);
const allergies = ref([]); // Daftar lengkap alergi dari DB (dengan ID dan Name)

// --- LOGIKA ALERGI BARU ---
const selectedAllergies = ref([]); // Array of IDs yang terpilih saat ini

// Mencari ID alergi "Tidak Ada" untuk logika pengecualian
const noAllergyItem = computed(() =>
  allergies.value.find((a) => a.name === 'Tidak Ada')
);

// Cek apakah "Tidak Ada" sedang terpilih
const isNoAllergySelected = computed(() => {
  return (
    noAllergyItem.value &&
    selectedAllergies.value.includes(noAllergyItem.value.id)
  );
});

// Fungsi untuk mendapatkan nama alergi dari ID yang terpilih (Digunakan saat Submit)
function getAllergyNames() {
  return selectedAllergies.value
    .map((id) => allergies.value.find((a) => a.id === id)?.name)
    .filter((name) => name);
}

// Handler perubahan checkbox
function onAllergyCheckboxChange(allergyId) {
  const isNoAllergy =
    noAllergyItem.value && allergyId === noAllergyItem.value.id;

  if (selectedAllergies.value.includes(allergyId)) {
    // Uncheck
    selectedAllergies.value = selectedAllergies.value.filter(
      (id) => id !== allergyId
    );
  } else {
    // Check
    if (isNoAllergy) {
      // Jika mencentang "Tidak Ada", hapus semua alergi lain
      selectedAllergies.value = [allergyId];
    } else if (isNoAllergySelected.value) {
      // Jika mencentang alergi lain saat "Tidak Ada" terpilih
      toast.warning(
        'Silakan unselect "Tidak Ada" terlebih dahulu untuk memilih alergi lain',
        { timeout: 3000 }
      );
      return;
    } else {
      // Centang alergi normal
      selectedAllergies.value.push(allergyId);
    }
  }
}
// --- AKHIR LOGIKA ALERGI BARU ---

// ✅ Fetch daftar alergi (Diperlukan pertama agar ID ada)
async function fetchAllergies() {
  try {
    const res = await axios.get('/allergy');
    allergies.value = res.data.data;
  } catch (err) {
    toast.error('Gagal memuat daftar alergi');
  }
}

// ✅ Fetch makanan detail (Disesuaikan untuk Alergi)
async function fetchFood() {
  loading.value = true;
  try {
    const res = await axios.get(`/food/${route.params.id}`);
    const data = res.data.data;

    // Reset dan isi form data lainnya
    form.value = {
      name: data.name,
      description: data.description,
      food_category_id: data.food_category_id,
      calories: data.calories,
      protein: data.protein,
      fat: data.fat,
      carbohydrates: data.carbohydrates,
      ukuran_satuan: data.ukuran_satuan,
      ukuran_satuan_nama: data.ukuran_satuan_nama,
      // 'allergies' di form.value tidak perlu diisi di sini karena kita menggunakan selectedAllergies.value
    };

    // Konversi nama alergi lama (dari API) menjadi ID yang saat ini berlaku
    selectedAllergies.value = [];
    if (data.allergies && data.allergies.length > 0) {
      data.allergies.forEach((allergyName) => {
        // Cari ID alergi berdasarkan nama
        const allergy = allergies.value.find((a) => a.name === allergyName);
        if (allergy) {
          selectedAllergies.value.push(allergy.id);
        }
      });
    }

    previewImage.value = data.image_url;
  } catch (err) {
    toast.error('Gagal memuat data makanan');
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// ✅ Fetch kategori makanan
async function fetchCategories() {
  try {
    const res = await axios.get('/food-category');
    categories.value = res.data.data;
  } catch (err) {
    toast.error('Gagal memuat kategori');
  }
}

// ✅ Handle file upload
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

// ✅ Submit update (Disesuaikan untuk Alergi)
async function handleUpdateFood() {
  loading.value = true;
  try {
    const formData = new FormData();
    const currentAllergyNames = getAllergyNames(); // Ambil NAMA alergi yang BARU terpilih

    // Append fields (kecuali kolom alergi lama di form.value)
    Object.entries(form.value).forEach(([key, val]) => {
      if (key !== 'allergies') {
        formData.append(key, val);
      }
    });

    // Tambahkan Alergi yang BARU terpilih (menggunakan nama, untuk di-sync oleh backend Laravel)
    if (currentAllergyNames.length > 0) {
      currentAllergyNames.forEach((name) => {
        formData.append('allergies[]', name);
      });
    } else {
      // Penting: Kirim array kosong jika tidak ada yang terpilih,
      // agar backend menghapus semua relasi yang sudah ada.
      formData.append('allergies[]', '');
    }

    // Append image if changed
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    // Kirim permintaan PUT
    await axios.post(`/food/${route.params.id}?_method=PUT`, formData);

    toast.success('Data makanan berhasil diperbarui');
    router.push('/admin/food');
  } catch (err) {
    console.error(err);
    // Tampilkan pesan error dari backend jika ada
    toast.error(err.response?.data?.message || 'Gagal memperbarui makanan');
  } finally {
    loading.value = false;
  }
}

// ✅ Lifecycle
onMounted(async () => {
  // Muat daftar alergi dulu agar data ID tersedia untuk digunakan di fetchFood
  await fetchAllergies();

  // Kemudian muat data makanan dan kategori
  fetchFood();
  fetchCategories();
});
</script>
