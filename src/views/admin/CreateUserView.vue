<template>
  <Layout title="Tambah User Baru">
    <div class="w-full max-w-5xl p-8 mx-auto bg-white shadow-lg rounded-xl">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-teal-700">
          ➕ Tambah Pengguna Baru
        </h1>
        <p class="mt-1 text-gray-600">
          Isi detail akun dan informasi profil untuk membuat pengguna baru.
        </p>
        <div class="h-1 mt-4 bg-teal-100 rounded"></div>
      </header>

      <form @submit.prevent="handleCreateUser" class="space-y-10">
        <section class="flex items-start pb-8 space-x-10 border-b">
          <div class="flex flex-col items-center flex-shrink-0 w-48">
            <label class="block mb-4 text-base font-semibold text-gray-700"
              >Foto Profil (Opsional)</label
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
                  >Pilih<br />Foto</span
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
              Klik area foto untuk memilih gambar
            </p>
          </div>

          <div class="grid flex-grow grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-teal-600"
                >Nama Lengkap <span class="text-red-500">*</span></label
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
                >Email <span class="text-red-500">*</span></label
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
                >Password <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.password"
                type="password"
                id="password"
                required
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label
                for="password_confirmation"
                class="block text-sm font-medium text-teal-600"
                >Konfirmasi Password <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.password_confirmation"
                type="password"
                id="password_confirmation"
                required
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
              <label
                for="sleep_duration"
                class="block text-sm font-medium text-teal-600"
                >Durasi Tidur Harian</label
              >
              <select
                v-model="form.sleep_duration"
                id="sleep_duration"
                class="block w-full px-4 py-2 mt-1 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Pilih Durasi Tidur</option>
                <option value="<7">Kurang dari 7 jam</option>
                <option value="7-9">7-9 jam</option>
                <option value="9-10">9-10 jam</option>
              </select>
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
                    >Tidak Hamil</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    :value="1"
                    v-model="form.is_pregnant"
                    class="text-teal-600 focus:ring-teal-500"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700"
                    >Hamil</span
                  >
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
                  @change="fetchRegencies(form.province_id)"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Pilih Provinsi</option>
                  <option
                    v-for="prov in provinces"
                    :key="prov.id"
                    :value="prov.id"
                  >
                    {{ prov.name }}
                  </option>
                </select>

                <select
                  v-model="form.regency_id"
                  @change="fetchDistricts(form.regency_id)"
                  :disabled="!form.province_id"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Pilih Kabupaten/Kota</option>
                  <option
                    v-for="kab in regencies"
                    :key="kab.id"
                    :value="kab.id"
                  >
                    {{ kab.name }}
                  </option>
                </select>

                <select
                  v-model="form.district_id"
                  @change="fetchVillages(form.district_id)"
                  :disabled="!form.regency_id"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Pilih Kecamatan</option>
                  <option
                    v-for="kec in districts"
                    :key="kec.id"
                    :value="kec.id"
                  >
                    {{ kec.name }}
                  </option>
                </select>

                <select
                  v-model="form.village_id"
                  :disabled="!form.district_id"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Pilih Kelurahan/Desa</option>
                  <option
                    v-for="desa in villages"
                    :key="desa.id"
                    :value="desa.id"
                  >
                    {{ desa.name }}
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
                Pilih alergi makanan user (opsional).
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
            <span v-else>Simpan Pengguna</span>
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
