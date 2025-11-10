<template>
  <Layout title="Linked Devices">
    <div class="">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-semibold">Linked Devices</h2>
        <div class="relative">
          <input
            v-model="search"
            @input="fetchDevices(1)"
            type="text"
            class="py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Cari ... "
          />
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
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

      <!-- Table -->
      <div
        v-else
        class="overflow-x-auto border border-gray-200 rounded-lg shadow-sm"
      >
        <table class="w-full text-sm">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th
                class="p-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Kode Device
              </th>
              <th
                class="p-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Nama User
              </th>
              <th
                class="p-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Email
              </th>
              <th
                class="p-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Registered At
              </th>
              <th
                class="p-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Last Sync
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in devices"
              :key="item.id"
              class="transition-colors hover:bg-gray-50"
            >
              <td class="p-4 text-center align-middle border-b border-gray-200">
                <span class="font-medium text-gray-800">{{
                  item.device_code
                }}</span>
              </td>
              <td class="p-4 text-center align-middle border-b border-gray-200">
                <span v-if="item.user?.name" class="text-gray-800">
                  {{ item.user.name }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="p-4 text-center align-middle border-b border-gray-200">
                <span v-if="item.user?.email" class="text-gray-800">
                  {{ item.user.email }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="p-4 text-center align-middle border-b border-gray-200">
                <span class="text-gray-600">
                  {{ formatDate(item.registered_at) }}
                </span>
              </td>
              <td class="p-4 text-center align-middle border-b border-gray-200">
                <span class="text-gray-600">
                  {{ formatDate(item.last_sync) }}
                </span>
              </td>
            </tr>
            <tr v-if="devices.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500">
                Tidak ada data
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Layout from '@/components/admin/Layout.vue';

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

const devices = ref([]);
const search = ref('');
const meta = ref({});
const rowPerPage = ref(10);
const loading = ref(false);

async function fetchDevices(page = 1) {
  loading.value = true;
  try {
    const res = await axios.get('/device/linked-devices', {
      params: { per_page: rowPerPage.value, page, search: search.value },
    });
    devices.value = res.data.data;
    meta.value = res.data.meta;
  } catch (err) {
    toast.error('Gagal memuat linked devices');
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  // buat hari bulan tahun dari dateStr
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // gabungkan hari, bulan, tahun ke dalam satu string
  return `${day}/${month}/${year}`;
}

onMounted(() => {
  fetchDevices();
});
</script>
