<template>
  <Layout title="Linked Devices">
    <div class="p-6 bg-white rounded shadow">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
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

      <!-- Table -->
      <div v-if="loading" class="py-6 text-center">⏳ Memuat data...</div>
      <div
        v-else
        class="overflow-x-auto border border-gray-200 rounded-lg shadow-sm"
      >
        <table class="w-full text-sm">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th
                class="p-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Kode Device
              </th>
              <th
                class="p-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Nama User
              </th>
              <th
                class="p-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Email
              </th>
              <th
                class="p-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Registered At
              </th>
              <th
                class="p-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Last Sync
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="item in devices"
              :key="item.id"
              class="transition-colors hover:bg-gray-50"
            >
              <td class="p-3 text-center align-middle border-b border-gray-200">
                <span class="font-medium text-gray-800">{{
                  item.device_code
                }}</span>
              </td>
              <td class="p-3 text-center align-middle border-b border-gray-200">
                <span v-if="item.user?.name" class="text-gray-800">
                  {{ item.user.name }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="p-3 text-center align-middle border-b border-gray-200">
                <span v-if="item.user?.email" class="text-gray-800">
                  {{ item.user.email }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="p-3 text-center align-middle border-b border-gray-200">
                <span class="text-gray-600">
                  {{ formatDate(item.registered_at) }}
                </span>
              </td>
              <td class="p-3 text-center align-middle border-b border-gray-200">
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
      <div v-if="meta.last_page > 1" class="flex justify-end gap-2 mt-4">
        <button
          v-for="page in meta.last_page"
          :key="page"
          @click="fetchDevices(page)"
          class="px-3 py-1 border rounded"
          :class="page === meta.current_page ? 'bg-teal-500 text-white' : ''"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Layout from '@/components/admin/Layout.vue';

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
