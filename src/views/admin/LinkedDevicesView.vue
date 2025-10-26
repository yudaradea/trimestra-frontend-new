<template>
  <Layout title="Linked Devices">
    <div class="p-6 bg-white rounded shadow">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Linked Devices</h2>
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
const meta = ref({});
const rowPerPage = ref(10);
const loading = ref(false);

async function fetchDevices(page = 1) {
  loading.value = true;
  try {
    const res = await axios.get('/device/linked-devices', {
      params: { per_page: rowPerPage.value, page },
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
  const d = new Date(dateStr);
  return d.toLocaleString();
}

onMounted(() => {
  fetchDevices();
});
</script>
