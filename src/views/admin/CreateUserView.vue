<template>
  <Layout title="Tambah User">
    <div class="p-6 bg-white rounded shadow">
      <h2 class="mb-6 text-xl font-semibold">Form Tambah User</h2>

      <form
        @submit.prevent="handleCreateUser"
        class="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <!-- Foto Profil -->
        <div class="flex flex-col items-center col-span-2">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Foto Profil</label
          >
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
            <!-- Overlay saat hover -->
            <div
              class="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100"
            >
              <span class="text-xs text-center text-white"
                >Ganti<br />Foto</span
              >
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p class="mt-2 text-xs text-gray-500">Klik untuk mengganti foto</p>
        </div>

        <!-- Nama -->
        <div>
          <label class="block mb-1 text-sm font-medium">Nama</label>
          <input v-model="form.name" type="text" class="input" required />
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input v-model="form.email" type="email" class="input" required />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="input"
            required
          />
        </div>

        <!-- Konfirmasi Password -->
        <div>
          <label class="block mb-1 text-sm font-medium"
            >Konfirmasi Password</label
          >
          <input
            v-model="form.password_confirmation"
            type="password"
            class="input"
            required
          />
        </div>

        <!-- Tanggal Lahir -->
        <div>
          <label class="block mb-1 text-sm font-medium">Tanggal Lahir</label>
          <input v-model="form.birth_date" type="date" class="input" />
        </div>

        <!-- Tinggi -->
        <div>
          <label class="block mb-1 text-sm font-medium">Tinggi (cm)</label>
          <input v-model="form.height" type="number" class="input" />
        </div>

        <!-- Berat -->
        <div>
          <label class="block mb-1 text-sm font-medium">Berat (kg)</label>
          <input v-model="form.weight" type="number" class="input" />
        </div>

        <!-- No HP -->
        <div>
          <label class="block mb-1 text-sm font-medium">No HP</label>
          <input v-model="form.no_hp" type="text" class="input" />
        </div>

        <!-- Durasi Tidur -->
        <div>
          <label class="block mb-1 text-sm font-medium"
            >Durasi Tidur Harian</label
          >

          <!-- buat dalam bentuk select -->
          <select v-model="form.sleep_duration" class="input">
            <option value="">Pilih Durasi Tidur</option>
            <option value="<7">Kurang dari 7 jam</option>
            <option value="7-9">7-9 jam</option>
            <option value="9-10">9-10 jam</option>
          </select>
        </div>

        <!-- Status Hamil -->
        <div>
          <label class="block mb-1 text-sm font-medium">Status Hamil</label>
          <select v-model="form.is_pregnant" class="input">
            <option :value="0">Tidak Hamil</option>
            <option :value="1">Hamil</option>
          </select>
        </div>

        <!-- Field tambahan jika hamil -->
        <div v-if="form.is_pregnant == 1">
          <label class="block mb-1 text-sm font-medium"
            >Usia Kehamilan (minggu)</label
          >
          <input v-model="form.weeks" type="number" class="input" />
        </div>
        <div v-if="form.is_pregnant == 1">
          <label class="block mb-1 text-sm font-medium">HPHT</label>
          <input v-model="form.hpht" type="date" class="input" />
        </div>

        <!-- Lokasi -->
        <div>
          <label class="block mb-1 text-sm font-medium">Provinsi</label>
          <select
            v-model="form.province_id"
            @change="fetchRegencies(form.province_id)"
            class="input"
          >
            <option value="">Pilih Provinsi</option>
            <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
              {{ prov.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Kabupaten</label>
          <select
            v-model="form.regency_id"
            @change="fetchDistricts(form.regency_id)"
            class="input"
            :disabled="!form.province_id"
          >
            <option value="">Pilih Kabupaten</option>
            <option v-for="kab in regencies" :key="kab.id" :value="kab.id">
              {{ kab.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Kecamatan</label>
          <select
            v-model="form.district_id"
            @change="fetchVillages(form.district_id)"
            class="input"
            :disabled="!form.regency_id"
          >
            <option value="">Pilih Kecamatan</option>
            <option v-for="kec in districts" :key="kec.id" :value="kec.id">
              {{ kec.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Desa</label>
          <select
            v-model="form.village_id"
            class="input"
            :disabled="!form.district_id"
          >
            <option value="">Pilih Desa</option>
            <option v-for="desa in villages" :key="desa.id" :value="desa.id">
              {{ desa.name }}
            </option>
          </select>
        </div>

        <!-- Alergi Makanan -->
        <div>
          <label class="block mb-1 text-sm font-medium">Alergi Makanan</label>
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
        </div>
      </form>

      <!-- Tombol -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="router.back()"
          class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Batal
        </button>
        <button
          @click="handleCreateUser"
          :disabled="loading"
          class="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from '@/lib/axios';
import { useLocation } from '@/composables/useLocation';
import { useAllergies } from '@/composables/useAllergies';
import Layout from '@/components/admin/Layout.vue';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const onAllergyCheckboxChange = (allergyId) => {
  const success = handleAllergyChange(allergyId);

  if (!success) {
    toast.warning(
      'Silakan unselect "Tidak Punya" terlebih dahulu untuk memilih alergi lain',
      {
        timeout: 3000,
      }
    );
  }
};

// Composable lokasi
const {
  provinces,
  regencies,
  districts,
  villages,
  fetchProvinces,
  fetchRegencies,
  fetchDistricts,
  fetchVillages,
} = useLocation();

// Composable alergi
const { allergies, fetchAllergies } = useAllergies();

// State form
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  birth_date: '',
  height: '',
  weight: '',
  no_hp: '',
  sleep_duration: '',
  is_pregnant: 0,
  weeks: '',
  hpht: '',
  province_id: '',
  regency_id: '',
  district_id: '',
  village_id: '',
  foto_profile: null,
});

// Preview foto
const previewImage = ref(null);

// Alergi yang dipilih
const selectedAllergies = ref([]);

// Handle upload foto
function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImage.value = ev.target.result;
    };
    reader.readAsDataURL(file);
    form.value.foto_profile = file;
  }
}

// Submit form
async function handleCreateUser() {
  loading.value = true;
  try {
    // Validasi khusus hamil
    if (
      form.value.is_pregnant == 1 &&
      (!form.value.weeks || !form.value.hpht)
    ) {
      toast.error('Mohon lengkapi data kehamilan');
      loading.value = false;
      return;
    }

    // Buat FormData untuk upload file
    const formData = new FormData();
    Object.keys(form.value).forEach((key) => {
      const value = form.value[key];
      if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Tambahkan alergi (pakai ID atau nama sesuai API)
    selectedAllergies.value.forEach((id) => {
      formData.append('food_allergies[]', id);
    });

    await axios.post('/user', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success('User berhasil ditambahkan!');
    router.push('/admin/users');
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Gagal menambahkan user');
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchProvinces();
  fetchAllergies();
});
</script>
