<template>
  <Layout title="Perbarui Profil">
    <div class="w-full max-w-5xl p-8 mx-auto bg-white shadow-lg rounded-xl">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-teal-700">✏️ Edit Profil</h1>
        <p class="mt-1 text-gray-600">
          Perbarui semua informasi detail profil Anda.
        </p>
        <div class="h-1 mt-4 bg-teal-100 rounded"></div>
      </header>

      <div
        v-if="initialLoading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="text-5xl animate-spin">⏳</div>
        <span class="mt-4 text-lg text-gray-600">Memuat data profil...</span>
      </div>

      <form v-else @submit.prevent="handleUpdateProfile" class="space-y-10">
        <section class="flex items-start pb-8 space-x-10 border-b">
          <div class="flex flex-col items-center flex-shrink-0 w-48">
            <label class="block mb-4 text-base font-semibold text-gray-700"
              >Foto Profil (Maksimal 2MB)</label
            >

            <div class="relative w-32 h-32 group">
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Preview"
                class="object-cover w-32 h-32 transition-shadow duration-300 border-4 border-teal-300 rounded-full shadow-md ring-4 ring-teal-100 group-hover:shadow-xl"
              />
              <div
                v-else
                class="flex items-center justify-center w-32 h-32 text-gray-500 bg-gray-100 border-4 border-gray-300 rounded-full shadow-md"
              >
                <span class="text-sm font-medium text-center"
                  >Pilih<br />Gambar</span
                >
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center transition-opacity bg-black rounded-full opacity-0 cursor-pointer bg-opacity-60 group-hover:opacity-100"
              >
                <span
                  class="text-sm font-bold tracking-wider text-center text-white"
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
            <p class="mt-3 text-sm text-gray-500">
              Klik area foto untuk mengganti
            </p>
          </div>

          <div class="flex-grow space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-teal-600"
                >Nama Lengkap</label
              >
              <input
                type="text"
                id="name"
                v-model="profileData.name"
                required
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-teal-600"
                >Email</label
              >
              <input
                type="email"
                id="email"
                v-model="profileData.email"
                required
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label for="no_hp" class="block text-sm font-medium text-teal-600"
                >Nomor Handphone</label
              >
              <input
                type="tel"
                id="no_hp"
                v-model="profileData.no_hp"
                placeholder="Masukkan nomor HP"
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label
                for="tanggal_lahir"
                class="block text-sm font-medium text-teal-600"
                >Tanggal Lahir</label
              >
              <input
                type="date"
                id="tanggal_lahir"
                v-model="profileData.birth_date"
                required
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          <section class="space-y-6">
            <h2 class="pb-2 text-xl font-semibold text-gray-700 border-b">
              Detail Kesehatan
            </h2>

            <div>
              <label
                for="berat_badan"
                class="block text-sm font-medium text-teal-600"
                >Berat Badan</label
              >
              <div class="relative mt-1">
                <input
                  type="number"
                  id="berat_badan"
                  v-model="profileData.weight"
                  required
                  min="20"
                  max="300"
                  step="0.1"
                  placeholder="Masukkan berat badan"
                  class="block w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <span
                  class="absolute inset-y-0 flex items-center text-sm text-gray-500 right-4"
                  >Kg</span
                >
              </div>
            </div>

            <div>
              <label
                for="tinggi_badan"
                class="block text-sm font-medium text-teal-600"
                >Tinggi Badan</label
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
                  class="block w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <span
                  class="absolute inset-y-0 flex items-center text-sm text-gray-500 right-4"
                  >cm</span
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-teal-600"
                >Durasi Tidur Harian</label
              >
              <div class="p-3 mt-2 space-y-2 border rounded-lg bg-gray-50">
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="<7"
                    v-model="profileData.sleep_duration"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-3 text-sm text-gray-700"
                    >Kurang dari 7 jam</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="7-9"
                    v-model="profileData.sleep_duration"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-3 text-sm text-gray-700">7-9 jam</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="9-10"
                    v-model="profileData.sleep_duration"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-3 text-sm text-gray-700">9-10 jam</span>
                </label>
              </div>
            </div>

            <div class="pt-2">
              <label class="block text-sm font-medium text-teal-600"
                >Apakah Kamu Sedang Hamil?</label
              >
              <div class="flex p-3 mt-2 space-x-6 border rounded-lg bg-gray-50">
                <label class="flex items-center">
                  <input
                    type="radio"
                    :value="0"
                    v-model="profileData.is_pregnant"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700"
                    >Tidak</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    :value="1"
                    v-model="profileData.is_pregnant"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700">Ya</span>
                </label>
              </div>
            </div>

            <div
              v-if="profileData.is_pregnant == 1"
              class="pt-4 space-y-4 border-t"
            >
              <h3 class="text-lg font-semibold text-teal-600">
                Detail Kehamilan
              </h3>
              <div>
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
                    class="block w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                  <span
                    class="absolute inset-y-0 flex items-center text-sm text-gray-500 right-4"
                    >minggu</span
                  >
                </div>
              </div>

              <div>
                <label
                  for="hpht"
                  class="block text-sm font-medium text-teal-600"
                  >Hari Pertama Menstruasi Terakhir (HPHT)</label
                >
                <div class="relative mt-1">
                  <input
                    type="date"
                    id="hpht"
                    v-model="profileData.hpht"
                    required
                    class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-6">
            <h2 class="pb-2 text-xl font-semibold text-gray-700 border-b">
              Lokasi & Alergi
            </h2>

            <div>
              <label class="block text-sm font-medium text-teal-600"
                >Lokasi Tempat Tinggal</label
              >
              <div class="mt-2 space-y-3">
                <select
                  v-model="profileData.province_id"
                  required
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
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

                <select
                  v-model="profileData.regency_id"
                  required
                  :disabled="!profileData.province_id"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

                <select
                  v-model="profileData.district_id"
                  required
                  :disabled="!profileData.regency_id"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

                <select
                  v-model="profileData.village_id"
                  required
                  :disabled="!profileData.district_id"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div class="pt-2">
              <label class="block mb-2 text-sm font-medium text-teal-600"
                >Alergi Makanan</label
              >
              <div
                class="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-gray-50"
              >
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
                    class="ml-2 text-sm text-gray-700 cursor-pointer select-none"
                  >
                    {{ allergy.name }}
                  </label>
                </div>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Pilih alergi makanan yang Kamu miliki. **Pastikan opsi "Tidak
                Punya" di-unselect jika memilih alergi lain.**
              </p>
            </div>
          </section>
        </div>

        <div class="flex justify-end pt-6 space-x-4 border-t">
          <button
            type="button"
            @click="handleCancel"
            class="px-8 py-3 font-semibold text-teal-600 transition bg-white border-2 border-teal-500 rounded-full shadow-md hover:bg-teal-50"
          >
            Batal
          </button>

          <button
            type="submit"
            :disabled="loading || !hasChanges"
            class="px-8 py-3 font-semibold text-white transition bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
          >
            <span v-if="loading" class="mr-2 animate-spin">🔄</span>
            <span v-else>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useProfileStore } from '@/stores/useProfileStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useLocation } from '@/composables/useLocation';
import { useAllergies } from '@/composables/useAllergies';
// import Header from '@/components/Header.vue'; // Dihapus/diganti
// import BottomNav from '@/components/BottomNav.vue'; // Dihapus/diganti
import Layout from '@/components/admin/Layout.vue'; // Menggunakan Layout Admin

const router = useRouter();
const toast = useToast();
const profileStore = useProfileStore();

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
  isNoAllergySelected,
  fetchAllergies,
  handleAllergyChange,
  getAllergyNames,
} = useAllergies();

const loading = ref(false);
const previewImage = ref(null);
const originalData = ref(null);
const initialLoading = ref(true); // Loading saat pertama kali load data

const profileData = ref({
  name: '',
  email: '',
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

// Computed untuk cek apakah ada perubahan
const hasChanges = computed(() => {
  if (!originalData.value) return false;

  // Cek perubahan pada field biasa
  const fieldsChanged = Object.keys(profileData.value).some((key) => {
    if (key === 'foto_profile') return !!profileData.value[key]; // Ada file baru

    const current = profileData.value[key];
    const original = originalData.value[key];

    // Konversi ke string untuk perbandingan yang konsisten
    return String(current || '') !== String(original || '');
  });

  // Cek perubahan alergi
  const originalAllergies = originalData.value.food_allergies || [];
  const currentAllergies = getAllergyNames();

  const allergiesChanged =
    originalAllergies.length !== currentAllergies.length ||
    !originalAllergies.every((a) => currentAllergies.includes(a)) ||
    !currentAllergies.every((a) => originalAllergies.includes(a));

  return fieldsChanged || allergiesChanged;
});

// Handler untuk checkbox change dengan toast
const onAllergyCheckboxChange = (allergyId) => {
  const success = handleAllergyChange(allergyId);

  if (!success) {
    toast.warning(
      'Silakan unselect "Tidak Ada" terlebih dahulu untuk memilih alergi lain',
      {
        timeout: 3000,
      }
    );
  }
};

// Load data profil
const loadProfile = async () => {
  initialLoading.value = true;
  try {
    await profileStore.fetchProfile();
    const profileResponse = profileStore.profile;

    if (profileResponse) {
      // Data user (name, email) langsung di level atas
      // Data detail profil ada di profileResponse.profile
      const profile = profileResponse.profile || {};
      const location = profile.location || {};

      // Set profile data
      profileData.value = {
        name: profileResponse.name || '',
        email: profileResponse.email || '',
        birth_date: profile.birth_date || '',
        province_id: location.province_id || '',
        regency_id: location.regency_id || '',
        district_id: location.district_id || '',
        village_id: location.village_id || '',
        height: profile.height || '',
        weight: profile.weight || '',
        foto_profile: null,
        no_hp: profile.no_hp || '',
        sleep_duration: profile.sleep_duration || '',
        is_pregnant: profile.is_pregnant ? 1 : 0,
        weeks: profile.weeks || '',
        hpht: profile.hpht || '',
      };

      // Set foto preview jika ada
      if (profile.foto_profile) {
        previewImage.value = profile.foto_profile;
      }

      // Load location data secara bertahap
      if (location.province_id) {
        await fetchRegencies(location.province_id);
        if (location.regency_id) {
          await fetchDistricts(location.regency_id);
          if (location.district_id) {
            await fetchVillages(location.district_id);
          }
        }
      }

      // Set allergies
      if (profile.food_allergies && profile.food_allergies.length > 0) {
        // Cari ID alergi berdasarkan nama
        profile.food_allergies.forEach((allergyName) => {
          const allergy = allergies.value.find((a) => a.name === allergyName);
          if (allergy && !selectedAllergies.value.includes(allergy.id)) {
            selectedAllergies.value.push(allergy.id);
          }
        });
      }

      // Simpan data original untuk deteksi perubahan
      originalData.value = {
        ...profileData.value,
        food_allergies: profile.food_allergies || [],
      };
    }
  } catch (error) {
    console.error('Load profile error:', error);
    toast.error('Gagal memuat data profil');
  } finally {
    initialLoading.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([fetchProvinces(), fetchAllergies()]);
    await loadProfile();
  } catch (error) {
    toast.error('Gagal memuat data awal');
  }
});

// Watchers untuk cascading dropdown
watch(
  () => profileData.value.province_id,
  async (newProvinceId, oldProvinceId) => {
    if (newProvinceId && newProvinceId !== oldProvinceId) {
      try {
        await fetchRegencies(newProvinceId);
        // Reset hanya jika user yang mengubah (bukan saat load data)
        if (oldProvinceId) {
          profileData.value.regency_id = '';
          profileData.value.district_id = '';
          profileData.value.village_id = '';
          districts.value = [];
          villages.value = [];
        }
      } catch (error) {
        toast.error('Gagal memuat data kabupaten/kota');
      }
    }
  }
);

watch(
  () => profileData.value.regency_id,
  async (newRegencyId, oldRegencyId) => {
    if (newRegencyId && newRegencyId !== oldRegencyId) {
      try {
        await fetchDistricts(newRegencyId);
        if (oldRegencyId) {
          profileData.value.district_id = '';
          profileData.value.village_id = '';
          villages.value = [];
        }
      } catch (error) {
        toast.error('Gagal memuat data kecamatan');
      }
    }
  }
);

watch(
  () => profileData.value.district_id,
  async (newDistrictId, oldDistrictId) => {
    if (newDistrictId && newDistrictId !== oldDistrictId) {
      try {
        await fetchVillages(newDistrictId);
        if (oldDistrictId) {
          profileData.value.village_id = '';
        }
      } catch (error) {
        toast.error('Gagal memuat data kelurahan/desa');
      }
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

const handleUpdateProfile = async () => {
  loading.value = true;

  try {
    // Validasi
    if (profileData.value.is_pregnant == 1) {
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
      // PERBAIKAN: Menggunakan 'Tidak Punya' sesuai dengan data yang diharapkan di DB
      formData.append('food_allergies[]', 'Tidak Ada');
    }

    // Send request menggunakan profile store
    await profileStore.updateProfile(formData);

    toast.success('Profil berhasil diperbarui!');

    // Update original data setelah berhasil save
    originalData.value = {
      ...profileData.value,
      food_allergies: allergyNames,
    };

    // Reset foto_profile karena sudah disimpan
    profileData.value.foto_profile = null;

    // Redirect atau refresh
    router.push('/admin/profile');
  } catch (error) {
    console.error('Update profile error:', error);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Gagal memperbarui profil';
    toast.error(message);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.back();
};
</script>
