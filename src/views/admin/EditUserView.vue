<template>
  <Layout title="Edit User">
    <div class="w-full max-w-5xl p-8 mx-auto bg-white shadow-lg rounded-xl">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-teal-700">⚙️ Edit Data Pengguna</h1>
        <p class="mt-1 text-gray-600">
          Perbarui informasi akun dan detail profil dari pengguna ini.
        </p>
        <div class="h-1 mt-4 bg-teal-100 rounded"></div>
      </header>

      <div
        v-if="initialLoading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="text-5xl animate-spin">⏳</div>
        <span class="mt-4 text-lg text-gray-600">Memuat data pengguna...</span>
      </div>

      <form v-else @submit.prevent="handleUpdateUser" class="space-y-10">
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

          <div class="grid flex-grow grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-teal-600"
                >Nama Lengkap</label
              >
              <input
                type="text"
                id="name"
                v-model="form.name"
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
                v-model="form.email"
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
                v-model="form.no_hp"
                placeholder="Masukkan nomor HP"
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label
                for="birth_date"
                class="block text-sm font-medium text-teal-600"
                >Tanggal Lahir</label
              >
              <input
                type="date"
                id="birth_date"
                v-model="form.birth_date"
                required
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-teal-600"
                >Role Pengguna</label
              >
              <select
                v-model="form.role"
                id="role"
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          <section class="space-y-6">
            <h2 class="pb-2 text-xl font-semibold text-gray-700 border-b">
              Keamanan Akun & Detail Kesehatan
            </h2>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-teal-600"
                >Password Baru (opsional)</label
              >
              <input
                v-model="form.password"
                type="password"
                id="password"
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                Kosongkan jika tidak ingin mengubah password
              </p>
            </div>

            <div>
              <label
                for="password_confirmation"
                class="block text-sm font-medium text-teal-600"
                >Konfirmasi Password Baru</label
              >
              <input
                v-model="form.password_confirmation"
                type="password"
                id="password_confirmation"
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label
                for="weight"
                class="block text-sm font-medium text-teal-600"
                >Berat Badan</label
              >
              <div class="relative mt-1">
                <input
                  type="number"
                  id="weight"
                  v-model="form.weight"
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
                for="height"
                class="block text-sm font-medium text-teal-600"
                >Tinggi Badan</label
              >
              <div class="relative mt-1">
                <input
                  type="number"
                  id="height"
                  v-model="form.height"
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
                    v-model="form.sleep_duration"
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
                    v-model="form.sleep_duration"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-3 text-sm text-gray-700">7-9 jam</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="9-10"
                    v-model="form.sleep_duration"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-3 text-sm text-gray-700">9-10 jam</span>
                </label>
              </div>
            </div>
          </section>

          <section class="space-y-6">
            <h2 class="pb-2 text-xl font-semibold text-gray-700 border-b">
              Lokasi & Status Kehamilan
            </h2>

            <div class="pt-2">
              <label class="block text-sm font-medium text-teal-600"
                >Apakah Pengguna Sedang Hamil?</label
              >
              <div class="flex p-3 mt-2 space-x-6 border rounded-lg bg-gray-50">
                <label class="flex items-center">
                  <input
                    type="radio"
                    :value="0"
                    v-model="form.is_pregnant"
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
                    v-model="form.is_pregnant"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700">Ya</span>
                </label>
              </div>
            </div>

            <div v-if="form.is_pregnant == 1" class="pt-4 space-y-4 border-t">
              <h3 class="text-lg font-semibold text-teal-600">
                Detail Kehamilan
              </h3>
              <div>
                <label
                  for="weeks"
                  class="block text-sm font-medium text-teal-600"
                  >Usia Kehamilan</label
                >
                <div class="relative mt-1">
                  <input
                    type="number"
                    id="weeks"
                    v-model="form.weeks"
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
                    v-model="form.hpht"
                    required
                    class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-teal-600"
                >Lokasi Tempat Tinggal</label
              >
              <div class="mt-2 space-y-3">
                <select
                  v-model="form.province_id"
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
                  v-model="form.regency_id"
                  required
                  :disabled="!form.province_id"
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
                  v-model="form.district_id"
                  required
                  :disabled="!form.regency_id"
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
                  v-model="form.village_id"
                  required
                  :disabled="!form.district_id"
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
                Pilih alergi makanan user. **Pastikan opsi "Tidak Ada"
                di-unselect jika memilih alergi lain.**
              </p>
            </div>
          </section>
        </div>

        <div class="flex justify-end pt-6 space-x-4 border-t">
          <button
            type="button"
            @click="router.back()"
            class="px-8 py-3 font-semibold text-teal-600 transition bg-white border-2 border-teal-500 rounded-full shadow-md hover:bg-teal-50"
          >
            Batal
          </button>

          <button
            type="submit"
            :disabled="loading"
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
