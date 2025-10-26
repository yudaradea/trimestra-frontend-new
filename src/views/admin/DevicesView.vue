<template>
  <Layout title="Manajemen Device">
    <div class="p-6 bg-white rounded shadow">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800">List Devices</h2>

        <div class="flex flex-wrap items-center gap-3">
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

          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <span>➕</span>
            Tambah Device
          </button>
        </div>
      </div>

      <!-- Table -->
      <div v-if="loading" class="py-6 text-center">⏳ Memuat data...</div>
      <table v-else class="w-full text-sm">
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

          <!-- jika tidak ada data munculkan tombol untuk menambah data -->
          <tr v-if="devices.length === 0">
            <td colspan="5" class="p-6 text-center text-gray-500">
              Tidak ada data device.
            </td>
          </tr>
        </tbody>
      </table>

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

onMounted(() => {
  fetchDevices();
});
</script>
