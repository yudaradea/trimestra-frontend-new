<template>
  <Layout title="Manajemen Users">
    <div class="">
      <!-- Top Bar -->
      <div
        class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- Search -->
        <input
          v-model="search"
          @input="fetchUsers"
          type="text"
          placeholder="🔍 Cari pengguna..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:w-64"
        />

        <div class="flex items-center gap-3">
          <!-- Row per page -->
          <select
            v-model="rowPerPage"
            @change="fetchUsers"
            class="w-48 px-3 py-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option :value="5">5 per halaman</option>
            <option :value="10">10 per halaman</option>
            <option :value="25">25 per halaman</option>
          </select>

          <!-- Filter Button -->
          <button
            @click="showFilter = true"
            class="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
          >
            Filter Lokasi
          </button>
          <button
            v-if="province || regency || district || village"
            @click="resetFilters"
            class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center p-16"
      >
        <!-- Ikon Spinner (Heroicons) -->
        <svg
          class="w-12 h-12 text-teal-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="mt-3 text-sm font-medium text-gray-600">Memuat data...</p>
      </div>

      <!-- Table (Menggunakan UserTableView yang sudah diperbarui) -->
      <UserTableInuser
        v-else
        :users="users"
        :sortBy="sortBy"
        :sortDirection="sortDirection"
        @sort="toggleSort"
        @edit="editUser"
        @delete="confirmDelete"
      />

      <!-- Pagination -->
      <div
        class="flex flex-col items-center justify-between gap-3 mt-6 text-sm sm:flex-row"
      >
        <span class="text-gray-600">
          Halaman <strong>{{ meta.current_page }}</strong> dari
          {{ meta.last_page }}
        </span>
        <div class="flex items-center gap-1">
          <button
            :disabled="meta.current_page === 1"
            @click="fetchDevices(meta.current_page - 1)"
            class="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          <!-- tampilkan halaman yang terlihat -->
          <template v-for="(page, i) in visiblePages" :key="i">
            <button
              v-if="page !== '...'"
              @click="fetchDevices(page)"
              class="px-3 py-1 rounded"
              :class="
                page === meta.current_page
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-500 select-none">...</span>
          </template>

          <button
            :disabled="meta.current_page === meta.last_page"
            @click="fetchDevices(meta.current_page + 1)"
            class="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Filter -->
    <Modal :show="showFilter" @close="showFilter = false" title="Filter Lokasi">
      <h1 class="mb-3 text-lg font-semibold text-center">Filter Lokasi</h1>

      <div class="grid gap-3 sm:grid-cols-2">
        <!-- Provinsi -->
        <select
          v-model="province"
          @change="
            () => {
              fetchRegencies(province);
              regency = '';
              district = '';
              village = '';
            }
          "
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Semua Provinsi</option>
          <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
            {{ prov.name }}
          </option>
        </select>

        <!-- Kabupaten -->
        <select
          v-model="regency"
          @change="
            () => {
              fetchDistricts(regency);
              district = '';
              village = '';
            }
          "
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          :disabled="!province"
        >
          <option value="">Semua Kabupaten</option>
          <option v-for="kab in regencies" :key="kab.id" :value="kab.id">
            {{ kab.name }}
          </option>
        </select>

        <!-- Kecamatan -->
        <select
          v-model="district"
          @change="
            () => {
              fetchVillages(district);
              village = '';
            }
          "
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          :disabled="!regency"
        >
          <option value="">Semua Kecamatan</option>
          <option v-for="kec in districts" :key="kec.id" :value="kec.id">
            {{ kec.name }}
          </option>
        </select>

        <!-- Desa -->
        <select
          v-model="village"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          :disabled="!district"
        >
          <option value="">Semua Desa</option>
          <option v-for="desa in villages" :key="desa.id" :value="desa.id">
            {{ desa.name }}
          </option>
        </select>
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <button
          @click="resetFilters"
          class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Reset
        </button>
        <button
          @click="applyFilters"
          class="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
        >
          Terapkan
        </button>
      </div>
    </Modal>

    <Modal
      :show="showDeleteModal"
      @close="showDeleteModal = false"
      title="Konfirmasi Hapus"
    >
      <div class="space-y-4">
        <p>
          Anda akan menghapus user <strong>{{ selectedUser?.name }}</strong
          >. Masukkan password admin untuk konfirmasi.
        </p>
        <input
          v-model="adminPassword"
          type="password"
          placeholder="Password Admin"
          class="input"
        />
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            @click="deleteUser"
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
import { ref, onMounted, computed } from 'vue';
import axios from '@/lib/axios';
import Layout from '@/components/admin/Layout.vue';
import UserTableInuser from '@/components/admin/UserTableInuser.vue';
import Modal from '@/components/Modal.vue';
import { useLocation } from '@/composables/useLocation';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

// pagination visible pages
const visiblePages = computed(() => {
  const total = meta.value.last_page || 1;
  const current = meta.value.current_page || 1;
  const delta = 3; // jumlah halaman di kiri-kanan halaman aktif
  const range = [];

  // batas awal dan akhir
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  // halaman pertama
  range.push(1);

  // tambahkan elipsis sebelum start jika jauh dari 2
  if (start > 2) range.push('...');

  // isi range tengah
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  // tambahkan elipsis sebelum halaman terakhir jika belum dekat
  if (end < total - 1) range.push('...');

  // halaman terakhir (hanya jika total > 1)
  if (total > 1) range.push(total);

  return range;
});

const toast = useToast();

const router = useRouter();

const editUser = (user) =>
  router.push({ name: 'admin-user-edit', params: { id: user.id } });

const loading = ref(true);
const users = ref([]);
const meta = ref({});
const search = ref('');
const rowPerPage = ref(10);
const currentPage = ref(1);
const showFilter = ref(false);

// sorting state
const sortBy = ref('');
const sortDirection = ref('asc');

// pakai composable lokasi
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

// filter state
const province = ref('');
const regency = ref('');
const district = ref('');
const village = ref('');

// modal delete
const showDeleteModal = ref(false);
const selectedUser = ref(null);
const adminPassword = ref('');

function confirmDelete(user) {
  selectedUser.value = user;
  adminPassword.value = '';
  showDeleteModal.value = true;
}

async function deleteUser() {
  if (!adminPassword.value) {
    toast.error('Password admin harus diisi');
    return;
  }
  try {
    await axios.delete(`/user/${selectedUser.value.id}`, {
      data: { password: adminPassword.value },
    });
    showDeleteModal.value = false;
    toast.success('User berhasil dihapus');
    fetchUsers();
  } catch (err) {
    console.error(err);
    toast.error(err.response.data.message);
  }
}

async function fetchUsers() {
  loading.value = true;
  try {
    const res = await axios.get('/user/all/paginated', {
      params: {
        search: search.value,
        row_per_page: rowPerPage.value,
        page: currentPage.value,
        province_id: province.value,
        regency_id: regency.value,
        district_id: district.value,
        village_id: village.value,
        sort_by: sortBy.value,
        sort_direction: sortDirection.value,
      },
    });
    users.value = res.data.data.data;
    meta.value = res.data.data.meta;
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
}

function changePage(page) {
  if (page >= 1 && page <= meta.value.last_page) {
    currentPage.value = page;
    fetchUsers();
  }
}

function resetFilters() {
  province.value = '';
  regency.value = '';
  district.value = '';
  village.value = '';
  currentPage.value = 1;
  fetchUsers();
}

function applyFilters() {
  showFilter.value = false;
  fetchUsers();
}

function toggleSort(column) {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortDirection.value = 'asc';
  }
  fetchUsers();
}

// lifecycle
onMounted(() => {
  fetchProvinces();
  fetchUsers();
});
</script>
