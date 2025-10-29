<template>
  <div class="flex justify-center min-h-screen overflow-y-auto bg-gray-50">
    <div class="flex flex-col justify-center w-full max-w-md p-6 bg-white">
      <!-- Header -->
      <div class="mb-6 text-center">
        <h1 class="text-xl font-bold text-gray-900">Selamat Datang</h1>
        <p class="mt-2 mb-4 text-xl font-bold text-gray-900">
          {{ authStore.user?.name }}
        </p>
        <p class="text-sm text-gray-600">
          Bantu TRIMESTRA personalisasi kondisi Kamu dengan menjawab pertanyaan
          berikut.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSaveProfile" class="space-y-6">
        <!-- Foto Profil -->
        <div class="flex flex-col items-center">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Foto Profil (Maksimal 2MB)</label
          >
          <div class="relative w-24 h-24">
            <img
              v-if="previewImage"
              :src="previewImage"
              alt="Preview"
              class="object-cover w-24 h-24 border rounded-full"
            />
            <div
              v-else
              class="flex items-center justify-center w-24 h-24 text-gray-400 bg-gray-100 border rounded-full"
            >
              Pilih Gambar
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <!-- Tanggal Lahir -->
        <div>
          <label
            for="tanggal_lahir"
            class="block text-sm font-medium text-teal-600"
            >Tanggal Lahir</label
          >
          <div class="relative mt-1">
            <input
              type="date"
              id="tanggal_lahir"
              v-model="profileData.birth_date"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <!-- Lokasi -->
        <div>
          <label class="block text-sm font-medium text-teal-600">Lokasi</label>
          <div class="mt-1 space-y-2">
            <!-- Provinsi -->
            <select
              v-model="profileData.province_id"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
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
              v-model="profileData.regency_id"
              required
              :disabled="!profileData.province_id"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
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
              v-model="profileData.district_id"
              required
              :disabled="!profileData.regency_id"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
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
              v-model="profileData.village_id"
              required
              :disabled="!profileData.district_id"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
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

        <!-- Tinggi Badan -->
        <div>
          <label
            for="tinggi_badan"
            class="block text-sm font-medium text-teal-600"
            >Tinggi</label
          >
          <div class="relative mt-1">
            <input
              type="number"
              id="tinggi_badan"
              v-model="profileData.height"
              required
              min="50"
              max="300"
              step="0.1"
              placeholder="Masukkan tinggi badan"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
            <span
              class="absolute inset-y-0 flex items-center text-sm text-gray-500 right-3"
              >cm</span
            >
          </div>
        </div>

        <!-- Berat Badan -->
        <div>
          <label
            for="berat_badan_awal"
            class="block text-sm font-medium text-teal-600"
            >Berat Badan</label
          >
          <div class="relative mt-1">
            <input
              type="number"
              id="berat_badan_awal"
              v-model="profileData.weight"
              required
              min="20"
              max="300"
              step="0.1"
              placeholder="Masukkan berat badan"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
            <span
              class="absolute inset-y-0 flex items-center text-sm text-gray-500 right-3"
              >Kg</span
            >
          </div>
        </div>

        <!-- Nomor HP -->
        <div>
          <label for="no_hp" class="block text-sm font-medium text-teal-600"
            >Nomor HP</label
          >
          <div class="relative mt-1">
            <input
              type="tel"
              id="no_hp"
              v-model="profileData.no_hp"
              placeholder="Masukkan nomor HP"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <!-- Durasi Tidur -->
        <div>
          <label class="block text-sm font-medium text-teal-600"
            >Durasi Tidur Harian</label
          >
          <div class="mt-1 space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                value="<7"
                v-model="profileData.sleep_duration"
                class="text-teal-600"
              />
              <span class="ml-2 text-sm text-gray-700">Kurang dari 7 jam</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                value="7-9"
                v-model="profileData.sleep_duration"
                class="text-teal-600"
              />
              <span class="ml-2 text-sm text-gray-700">7-9 jam</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                value="9-10"
                v-model="profileData.sleep_duration"
                class="text-teal-600"
              />
              <span class="ml-2 text-sm text-gray-700">9-10 jam</span>
            </label>
          </div>
        </div>

        <!-- Alergi Makanan -->
        <div>
          <label class="block text-sm font-medium text-teal-600"
            >Alergi Makanan</label
          >
          <div class="mt-1 space-y-2">
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
            Pilih alergi makanan yang Kamu miliki. Jika pilih "Tidak Punya",
            unselect terlebih dahulu untuk memilih alergi lain.
          </p>
        </div>

        <!-- Status Kehamilan -->
        <div>
          <label class="block text-sm font-medium text-teal-600"
            >Apakah Kamu Sedang Hamil?</label
          >
          <div class="mt-1 space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                :value="0"
                v-model="profileData.is_pregnant"
                class="text-teal-600"
              />
              <span class="ml-2 text-sm text-gray-700">Tidak</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                :value="1"
                v-model="profileData.is_pregnant"
                class="text-teal-600"
              />
              <span class="ml-2 text-sm text-gray-700">Ya</span>
            </label>
          </div>
        </div>

        <!-- Detail Kehamilan (jika hamil) -->
        <div v-if="profileData.is_pregnant">
          <!-- Usia Kehamilan -->
          <div class="mb-4">
            <label
              for="usia_kehamilan"
              class="block text-sm font-medium text-teal-600"
              >Usia Kehamilan</label
            >
            <div class="relative mt-1">
              <input
                type="number"
                id="usia_kehamilan"
                v-model="profileData.weeks"
                required
                min="1"
                max="42"
                placeholder="Masukkan usia kehamilan"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
              <span
                class="absolute inset-y-0 flex items-center text-sm text-gray-500 right-3"
                >minggu</span
              >
            </div>
          </div>

          <!-- HPHT -->
          <div>
            <label for="hpht" class="block text-sm font-medium text-teal-600"
              >Hari Pertama Menstruasi Terakhir (HPHT)</label
            >
            <div class="relative mt-1">
              <input
                type="date"
                id="hpht"
                v-model="profileData.hpht"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        <!-- Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 font-semibold text-white transition bg-teal-500 rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="mr-2 animate-spin">⏳</span>
            Lanjutkan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useLocation } from '@/composables/useLocation';
import { useAllergies } from '@/composables/useAllergies';
import api from '@/lib/axios';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

// Composables
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

const {
  allergies,
  selectedAllergies,
  noAllergyId,
  isNoAllergySelected,
  fetchAllergies,
  handleAllergyChange,
  getAllergyNames,
} = useAllergies();

const loading = ref(false);
const previewImage = ref(null);

const user = computed(() => authStore.user);

const profileData = ref({
  birth_date: '',
  province_id: '',
  regency_id: '',
  district_id: '',
  village_id: '',
  height: '',
  weight: '',
  foto_profile: null,
  no_hp: '',
  sleep_duration: '',
  is_pregnant: 0,
  weeks: '',
  hpht: '',
});

// Handler untuk checkbox change dengan toast
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

onMounted(async () => {
  try {
    if (!user.value) {
      await authStore.fetchUser();
    }
    await Promise.all([fetchProvinces(), fetchAllergies()]);
  } catch (error) {
    toast.error('Gagal memuat data awal');
  }
});

// Watchers untuk cascading dropdown
watch(
  () => profileData.value.province_id,
  async (newProvinceId) => {
    try {
      await fetchRegencies(newProvinceId);
      // Reset dependent fields
      profileData.value.regency_id = '';
      profileData.value.district_id = '';
      profileData.value.village_id = '';
      districts.value = [];
      villages.value = [];
    } catch (error) {
      toast.error('Gagal memuat data kabupaten/kota');
    }
  }
);

watch(
  () => profileData.value.regency_id,
  async (newRegencyId) => {
    try {
      await fetchDistricts(newRegencyId);
      profileData.value.district_id = '';
      profileData.value.village_id = '';
      villages.value = [];
    } catch (error) {
      toast.error('Gagal memuat data kecamatan');
    }
  }
);

watch(
  () => profileData.value.district_id,
  async (newDistrictId) => {
    try {
      await fetchVillages(newDistrictId);
      profileData.value.village_id = '';
    } catch (error) {
      toast.error('Gagal memuat data kelurahan/desa');
    }
  }
);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validasi file
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
    profileData.value.foto_profile = file;
  }
};

const handleSaveProfile = async () => {
  loading.value = true;

  try {
    // Validasi
    if (profileData.value.is_pregnant) {
      if (!profileData.value.weeks || !profileData.value.hpht) {
        toast.error('Mohon lengkapi data kehamilan');
        loading.value = false;
        return;
      }
    }

    // Create FormData
    const formData = new FormData();

    // Add all profile data
    Object.keys(profileData.value).forEach((key) => {
      const value = profileData.value[key];

      if (key === 'foto_profile') {
        if (value) formData.append(key, value);
      } else if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Add allergies dengan NAME bukan ID
    const allergyNames = getAllergyNames();
    if (allergyNames.length > 0) {
      allergyNames.forEach((name) => {
        formData.append('food_allergies[]', name);
      });
    } else if (isNoAllergySelected.value) {
      // Jika pilih "Tidak Punya", kirim array kosong atau string khusus
      // Sesuaikan dengan kebutuhan backend:
      // Option 1: Kirim empty array (tidak append apa-apa)
      // Option 2: Kirim string khusus
      formData.append('food_allergies[]', 'Tidak Punya');
    }

    // Debug log
    console.log('Selected Allergy Names:', allergyNames);

    // Send request menggunakan axios
    const response = await api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update auth store
    authStore.user = response.data.data;

    toast.success('Profil berhasil disimpan!');
    router.push('/');
  } catch (error) {
    console.error('Save profile error:', error);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Gagal menyimpan profil';
    toast.error(message);
  } finally {
    loading.value = false;
  }
};
</script>
