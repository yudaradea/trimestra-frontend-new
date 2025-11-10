<template>
  <Layout title="Manajemen Device">
    <div class="p-6 bg-white rounded shadow">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800">List Devices</h2>

        <button
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <span>➕</span>
          Tambah Device
        </button>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-3">
        <div class="flex items-center gap-2">
          <label for="perPage" class="text-sm text-gray-600">Tampilkan</label>
          <select
            id="perPage"
            v-model="rowPerPage"
            @change="fetchDevices(1)"
            class="py-2 pl-3 pr-8 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <!-- search -->
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

        <button
          @click="printLabel(selectedCodes)"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="selectedCodes.length === 0"
        >
          <span>🖨️</span>
          Print
          <span v-if="selectedCodes.length > 0" class="font-bold">
            {{ selectedCodes.length }}
          </span>
          Label
        </button>
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
      <table v-else class="w-full mt-8 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="p-3 font-medium text-center text-gray-600 border-b border-gray-200"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="rounded text-primary focus:ring-primary/50 focus:ring-2"
              />
            </th>
            <th
              class="p-3 font-medium text-center text-gray-600 border-b border-gray-200"
            >
              Kode Device
            </th>
            <th
              class="p-3 font-medium text-center text-gray-600 border-b border-gray-200"
            >
              Nama Device
            </th>
            <th
              class="p-3 font-medium text-center text-gray-600 border-b border-gray-200"
            >
              Barcode
            </th>
            <th
              class="p-3 font-medium text-center text-gray-600 border-b border-gray-200"
            >
              User
            </th>

            <th
              class="p-3 font-medium text-right text-gray-600 border-b border-gray-200"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in devices"
            :key="item.id"
            class="transition-colors hover:bg-gray-50"
          >
            <td class="p-3 text-center align-middle border-b border-gray-200">
              <input
                type="checkbox"
                v-model="selectedCodes"
                :value="item.device_code"
                class="rounded text-primary focus:ring-primary/50 focus:ring-2"
              />
            </td>
            <td class="p-3 text-center align-middle border-b border-gray-200">
              {{ item.device_code }}
            </td>
            <td class="p-3 text-center align-middle border-b border-gray-200">
              {{ item.device_name }}
            </td>
            <td class="p-3 text-center align-middle border-b border-gray-200">
              <div class="inline-flex flex-col items-center justify-center">
                <qrcode-vue :value="item.device_code" :size="50" />
                <span class="mt-2 text-xs font-semibold">{{
                  item.device_code
                }}</span>
              </div>
            </td>
            <td class="p-3 text-center align-middle border-b border-gray-200">
              <span v-if="item.user?.name" class="text-gray-800">
                {{ item.user.name }}
              </span>
              <span v-else class="text-gray-400">Belum Tertaut</span>
            </td>
            <td class="p-3 align-middle border-b border-gray-200">
              <div class="flex justify-end gap-2">
                <button
                  @click="printLabel([item.device_code])"
                  class="px-3 py-1 text-white transition-colors bg-gray-600 rounded hover:bg-gray-700"
                >
                  Print
                </button>
                <button
                  @click="openEditModal(item)"
                  class="px-3 py-1 text-white transition-colors rounded bg-primary hover:bg-primary/80"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(item)"
                  class="px-3 py-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>

          <!-- jika tidak ada  -->
          <tr v-if="devices.length === 0">
            <td colspan="5" class="p-6 text-center text-gray-500">
              Tidak ada data device.
            </td>
          </tr>
        </tbody>
      </table>

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

    <!-- Modal Create/Edit -->
    <Modal :show="showFormModal" @close="closeFormModal">
      <template #title>{{
        editing ? 'Edit Device' : 'Tambah Device'
      }}</template>
      <div class="space-y-4">
        <div class="space-y-3">
          <input
            v-model="form.device_code"
            type="text"
            class="w-full input"
            placeholder="Kode device"
            :disabled="editing"
          />
          <input
            v-model="form.device_name"
            type="text"
            class="w-full input"
            placeholder="Nama device"
          />
        </div>
        <div class="flex items-center justify-end gap-2">
          <button
            @click="closeFormModal"
            class="px-4 py-2 text-white bg-gray-400 rounded"
          >
            Batal
          </button>
          <button
            @click="submitForm"
            class="px-4 py-2 text-white rounded bg-primary"
          >
            {{ editing ? 'Simpan Perubahan' : 'Tambah' }}
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal Delete -->
    <Modal :show="showDeleteModal" @close="closeDeleteModal">
      <template #title>Hapus Device</template>
      <p>
        Yakin ingin menghapus device <strong>{{ selected?.device_code }}</strong
        >?
      </p>
      <div class="flex items-center justify-end gap-2 mt-4">
        <button
          @click="closeDeleteModal"
          class="px-4 py-2 text-white bg-gray-400 rounded"
        >
          Batal
        </button>
        <button
          @click="deleteDevice"
          class="px-4 py-2 text-white bg-red-500 rounded"
        >
          Hapus
        </button>
      </div>
    </Modal>

    <!-- Area khusus print -->
    <div id="print-area" class="flex-wrap hidden gap-4 p-4 print:flex">
      <div
        v-for="c in selectedCodes"
        :key="c"
        class="flex flex-col items-center w-32 px-2 pt-2 pb-1 border"
      >
        <qrcode-vue :value="c" :size="100" />
        <span class="mt-1 text-xs font-bold">{{ c }}</span>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import axios from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Layout from '@/components/admin/Layout.vue';
import Modal from '@/components/Modal.vue';
import QrcodeVue from 'qrcode.vue';

const toast = useToast();

// state
const devices = ref([]);
const meta = ref({});
const rowPerPage = ref(10);
const loading = ref(false);
const search = ref('');

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref(false);
const selected = ref(null);
const selectedCodes = ref([]);

const form = ref({
  device_code: '',
  device_name: '',
});

// fetch devices
async function fetchDevices(page = 1) {
  loading.value = true;
  try {
    const res = await axios.get('/device', {
      params: {
        per_page: rowPerPage.value,
        search: search.value,
        page,
      },
    });
    devices.value = res.data.data;
    meta.value = res.data.meta;
  } catch (err) {
    toast.error('Gagal memuat data device');
  } finally {
    loading.value = false;
  }
}

// select all
const allSelected = computed(() => {
  return (
    devices.value.length > 0 &&
    selectedCodes.value.length === devices.value.length
  );
});

function toggleSelectAll(e) {
  if (e.target.checked) {
    selectedCodes.value = devices.value.map((d) => d.device_code);
  } else {
    selectedCodes.value = [];
  }
}

// modal handlers
function openCreateModal() {
  editing.value = false;
  form.value = { device_code: '', device_name: '' };
  showFormModal.value = true;
}

function openEditModal(item) {
  editing.value = true;
  selected.value = item;
  form.value = { ...item };
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
  form.value = {};
  selected.value = null;
}

function openDeleteModal(item) {
  selected.value = item;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  selected.value = null;
}

// submit create/edit
async function submitForm() {
  try {
    if (editing.value) {
      await axios.put(`/device/${selected.value.id}`, form.value);
      toast.success('Device berhasil diperbarui');
    } else {
      await axios.post('/device', form.value);
      toast.success('Device berhasil ditambahkan');
    }
    closeFormModal();
    fetchDevices(meta.value.current_page || 1);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menyimpan device');
  }
}

// delete
async function deleteDevice() {
  try {
    await axios.delete(`/device/${selected.value.id}`);
    toast.success('Device berhasil dihapus');
    closeDeleteModal();
    fetchDevices(meta.value.current_page || 1);
  } catch (err) {
    toast.error('Gagal menghapus device');
  }
}

// print labels (gunakan area #print-area)
async function printLabel(codes) {
  if (!codes || codes.length === 0) return;
  selectedCodes.value = codes;
  await nextTick(); // tunggu DOM update agar tidak blank
  window.print();
}

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

onMounted(() => {
  fetchDevices();
});
</script>
