<template>
  <Layout title="Edit User">
    <!-- Loading State -->
    <div
      v-if="initialLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat data user...</span>
    </div>

    <div v-else class="p-6 bg-white rounded shadow">
      <h2 class="mb-6 text-xl font-semibold">Form Edit User</h2>

      <form
        @submit.prevent="handleUpdateUser"
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

        <!-- Role -->
        <div>
          <label class="block mb-1 text-sm font-medium">Role</label>
          <select v-model="form.role" class="input">
            <option value="">Pilih Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Password (opsional) -->
        <div>
          <label class="block mb-1 text-sm font-medium"
            >Password (opsional)</label
          >
          <input v-model="form.password" type="password" class="input" />
          <p class="mt-1 text-xs text-gray-500">
            Kosongkan jika tidak ingin mengubah password
          </p>
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
          <input v-model="form.height" type="number" class="input" step="0.1" />
        </div>

        <!-- Berat -->
        <div>
          <label class="block mb-1 text-sm font-medium">Berat (kg)</label>
          <input v-model="form.weight" type="number" class="input" step="0.1" />
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
          <select v-model="form.sleep_duration" class="input">
            <option value="">Pilih Durasi Tidur</option>
            <option value="<7">Kurang dari 7 jam</option>
            <option value="7-9">7-9 jam</option>
            <option value="9-10">9-10 jam</option>
          </select>
        </div>

        <!-- Lokasi -->
        <div class="col-span-2">
          <label class="block mb-2 text-sm font-medium">Lokasi</label>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <!-- Provinsi -->
            <select v-model="form.province_id" class="input">
              <option value="">Pilih Provinsi</option>
              <option
                v-for="province in provinces"
                :key="province.id"
                :value="province.id"
              >
                {{ province.name }}
              </option>
            </select>

            <!-- Kabupaten/Kota -->
            <select
              v-model="form.regency_id"
              :disabled="!form.province_id"
              class="input"
            >
              <option value="">Pilih Kabupaten/Kota</option>
              <option
                v-for="regency in regencies"
                :key="regency.id"
                :value="regency.id"
              >
                {{ regency.name }}
              </option>
            </select>

            <!-- Kecamatan -->
            <select
              v-model="form.district_id"
              :disabled="!form.regency_id"
              class="input"
            >
              <option value="">Pilih Kecamatan</option>
              <option
                v-for="district in districts"
                :key="district.id"
                :value="district.id"
              >
                {{ district.name }}
              </option>
            </select>

            <!-- Kelurahan/Desa -->
            <select
              v-model="form.village_id"
              :disabled="!form.district_id"
              class="input"
            >
              <option value="">Pilih Kelurahan/Desa</option>
              <option
                v-for="village in villages"
                :key="village.id"
                :value="village.id"
              >
                {{ village.name }}
              </option>
            </select>
          </div>
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
          <input
            v-model="form.weeks"
            type="number"
            class="input"
            min="1"
            max="42"
          />
        </div>
        <div v-if="form.is_pregnant == 1" class="col-span-2">
          <label class="block mb-1 text-sm font-medium">HPHT</label>
          <input v-model="form.hpht" type="date" class="input" />
        </div>

        <!-- Alergi Makanan -->
        <div class="col-span-2">
          <label class="block mb-2 text-sm font-medium text-teal-600"
            >Alergi Makanan</label
          >
          <div class="grid grid-cols-2 gap-2 mt-1 md:grid-cols-3">
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
          <p class="mt-2 text-xs text-gray-500">
            Pilih alergi makanan yang dimiliki user. Jika pilih "Tidak Punya",
            unselect terlebih dahulu untuk memilih alergi lain.
          </p>
        </div>
      </form>

      <!-- Tombol -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="router.back()"
          type="button"
          class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Batal
        </button>
        <button
          @click="handleUpdateUser"
          :disabled="loading"
          class="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="mr-2 animate-spin">⏳</span>
          {{ loading ? 'Menyimpan...' : 'Update' }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from '@/lib/axios';
import { useLocation } from '@/composables/useLocation';
import { useAllergies } from '@/composables/useAllergies';
import Layout from '@/components/admin/Layout.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const initialLoading = ref(true);

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
const { allergies, selectedAllergies, fetchAllergies, handleAllergyChange } =
  useAllergies();

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

// State form
const form = ref({
  name: '',
  email: '',
  role: '',
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

// Handle upload foto
function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    // Validasi tipe file
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file harus berupa gambar (JPG, PNG, GIF, atau WEBP)');
      e.target.value = '';
      return;
    }

    // Validasi ukuran
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 2MB');
      e.target.value = '';
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

// Load data user untuk edit
async function loadUser() {
  try {
    const res = await axios.get(`/user/${route.params.id}`);
    const user = res.data.data;
    form.value.name = user.name;
    form.value.email = user.email;
    form.value.role = user.role || '';

    // Profile data - akses dari user.profile
    const profile = user.profile || {};
    const location = profile.location || {};

    form.value.birth_date = profile.birth_date || '';
    form.value.height = profile.height || '';
    form.value.weight = profile.weight || '';
    form.value.no_hp = profile.no_hp || '';
    form.value.sleep_duration = profile.sleep_duration || '';
    form.value.is_pregnant = profile.is_pregnant ? 1 : 0;
    form.value.weeks = profile.weeks || '';
    form.value.hpht = profile.hpht || '';

    // Location data
    form.value.province_id = location.province_id || '';
    form.value.regency_id = location.regency_id || '';
    form.value.district_id = location.district_id || '';
    form.value.village_id = location.village_id || '';

    // Foto profil
    if (profile.foto_profile) {
      previewImage.value = profile.foto_profile;
    }

    // Load lokasi bertingkat
    if (form.value.province_id) {
      await fetchRegencies(form.value.province_id);
      if (form.value.regency_id) {
        await fetchDistricts(form.value.regency_id);
        if (form.value.district_id) {
          await fetchVillages(form.value.district_id);
        }
      }
    }

    // Set alergi - PENTING: Map dari NAME ke ID
    if (profile.food_allergies && profile.food_allergies.length > 0) {
      // Clear selected allergies first
      selectedAllergies.value = [];

      // Map allergy names to IDs
      profile.food_allergies.forEach((allergyName) => {
        const allergy = allergies.value.find((a) => a.name === allergyName);
        if (allergy && !selectedAllergies.value.includes(allergy.id)) {
          selectedAllergies.value.push(allergy.id);
        }
      });
    }
  } catch (err) {
    console.error('Load user error:', err);
    toast.error('Gagal memuat data user');
  }
}

// Submit update
async function handleUpdateUser() {
  loading.value = true;
  try {
    const formData = new FormData();

    // Add all form fields
    Object.keys(form.value).forEach((key) => {
      const value = form.value[key];

      // Skip password fields if empty
      if ((key === 'password' || key === 'password_confirmation') && !value) {
        return;
      }

      // Skip foto_profile, handle separately
      if (key === 'foto_profile') {
        return;
      }

      if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Add foto_profile if new file uploaded
    if (form.value.foto_profile && form.value.foto_profile instanceof File) {
      formData.append('foto_profile', form.value.foto_profile);
    }

    // Add allergies dengan NAME (bukan ID)
    const allergyNames = selectedAllergies.value
      .map((id) => allergies.value.find((a) => a.id === id)?.name)
      .filter((name) => name);

    if (allergyNames.length > 0) {
      allergyNames.forEach((name) => {
        formData.append('food_allergies[]', name);
      });
    }

    // Send request
    await axios.post(`/user/${route.params.id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success('User berhasil diupdate!');
    router.push('/admin/users');
  } catch (err) {
    console.error('Update error:', err);
    console.error('Error response:', err.response?.data);

    if (err.response?.data?.errors) {
      const errorMessages = Object.values(err.response.data.errors).flat();
      toast.error(errorMessages.join(', '));
    } else {
      toast.error(err.response?.data?.message || 'Gagal update user');
    }
  } finally {
    loading.value = false;
  }
}

// Watchers untuk cascading dropdown
watch(
  () => form.value.province_id,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      await fetchRegencies(newVal);
      if (oldVal) {
        form.value.regency_id = '';
        form.value.district_id = '';
        form.value.village_id = '';
      }
    }
  }
);

watch(
  () => form.value.regency_id,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      await fetchDistricts(newVal);
      if (oldVal) {
        form.value.district_id = '';
        form.value.village_id = '';
      }
    }
  }
);

watch(
  () => form.value.district_id,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      await fetchVillages(newVal);
      if (oldVal) {
        form.value.village_id = '';
      }
    }
  }
);

// Lifecycle
onMounted(async () => {
  try {
    // Load data secara parallel
    await Promise.all([fetchProvinces(), fetchAllergies()]);

    // Load user data setelah allergies dimuat
    await loadUser();
  } catch (error) {
    console.error('Failed to load initial data:', error);
    toast.error('Gagal memuat data awal');
  } finally {
    initialLoading.value = false;
  }
});
</script>
