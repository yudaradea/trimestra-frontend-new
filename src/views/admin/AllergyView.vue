<template>
  <Layout title="Manajemen Alergi">
    <div class="">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Daftar Alergi</h2>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <span>➕</span>
            Tambah Alergi
          </button>
        </div>
      </div>

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

      <div v-else class="mt-8 border border-gray-200 rounded-lg shadow-sm">
        <div class="overflow-x-auto rounded-lg"></div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="text-gray-600 bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                No
              </th>
              <th
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Nama Alergi
              </th>
              <th scope="col" class="relative px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in allergies" :key="item.name">
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ index + 1 }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.name }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                <div class="flex items-center justify-center gap-2 px-4 py-2">
                  <button
                    @click="openEditModal(item)"
                    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-all bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <!-- Ikon Edit (Heroicons) -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 transition-all rounded-md shadow-sm bg-red-50 ring-1 ring-inset ring-red-200 hover:bg-red-100"
                  >
                    <!-- Ikon Hapus (Heroicons) -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.11-2.368.11a.75.75 0 00-.73.73V5.8c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-.764a.75.75 0 00-.73-.73c-.788 0-1.573-.033-2.368-.11v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.5.66 1.5 1.5V6h-3V5.5A1.5 1.5 0 0110 4zM8.5 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM11.5 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5z"
                        clip-rule="evenodd"
                      />
                      <path
                        d="M1.956 7.362A.75.75 0 013.23 6.75h10.54a.75.75 0 011.274.612l-1.002 7.502A2.25 2.25 0 0111.796 17H5.204a2.25 2.25 0 01-2.244-2.136L1.956 7.362z"
                      />
                    </svg>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <Modal :show="showFormModal" @close="closeFormModal">
      <template #title>{{
        editing ? 'Edit Alergi' : 'Tambah Alergi'
      }}</template>

      <input
        v-model="form.name"
        type="text"
        class="w-full input"
        placeholder="Nama alergi"
      />

      <div class="flex items-center justify-end gap-2 mt-4">
        <button @click="closeFormModal" class="px-4 py-2 bg-gray-200 rounded">
          Batal
        </button>
        <button
          @click="submitForm"
          class="px-4 py-2 text-white bg-teal-500 rounded"
        >
          {{ editing ? 'Simpan' : 'Tambah' }}
        </button>
      </div>
    </Modal>

    <!-- Modal Delete -->
    <Modal :show="showDeleteModal" @close="closeDeleteModal">
      <template #title>Hapus Alergi</template>

      <p>
        Yakin ingin menghapus alergi <strong>{{ selected.name }}</strong
        >?
      </p>

      <div class="flex justify-end gap-3 mt-4">
        <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-200 rounded">
          Batal
        </button>
        <button
          @click="deleteAllergy"
          class="px-4 py-2 text-white bg-red-500 rounded"
        >
          Hapus
        </button>
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Layout from '@/components/admin/Layout.vue';
import Modal from '@/components/Modal.vue';

const toast = useToast();

const allergies = ref([]);
const loading = ref(false);

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref(false);
const selected = ref(null);

const form = ref({ name: '' });

// Fetch all allergies
async function fetchAllergies() {
  loading.value = true;
  try {
    const res = await axios.get('/allergy');
    allergies.value = res.data.data;
  } catch (err) {
    toast.error('Gagal memuat data alergi');
  } finally {
    loading.value = false;
  }
}

// Modal handlers
function openCreateModal() {
  editing.value = false;
  form.value = { name: '' };
  showFormModal.value = true;
}

function openEditModal(item) {
  editing.value = true;
  selected.value = item;
  form.value = { name: item.name };
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
  form.value = { name: '' };
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

// Submit create/edit
async function submitForm() {
  try {
    if (editing.value) {
      await axios.put(`/allergy/${selected.value.id}`, form.value);
      toast.success('Alergi berhasil diperbarui');
    } else {
      await axios.post('/allergy', form.value);
      toast.success('Alergi berhasil ditambahkan');
    }
    closeFormModal();
    fetchAllergies();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menyimpan alergi');
  }
}

// Delete
async function deleteAllergy() {
  try {
    await axios.delete(`/allergy/${selected.value.id}`);
    toast.success('Alergi berhasil dihapus');
    closeDeleteModal();
    fetchAllergies();
  } catch (err) {
    toast.error('Gagal menghapus alergi');
  }
}

onMounted(fetchAllergies);
</script>
