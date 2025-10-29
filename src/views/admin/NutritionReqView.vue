<template>
  <Layout title="Target Nutrisi">
    <div class="">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-semibold">Daftar Target Nutrisi</h2>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <span>➕</span>
            Tambah Target Nutrisi
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

      <!-- Table -->
      <div
        v-else
        class="p-2 mt-8 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <div class="overflow-x-auto rounded-lg"></div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="text-gray-600 bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Kategori BMI
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Hamil
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Trimester
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Kalori
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Protein
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Karbohidrat
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Lemak
              </th>
              <th scope="col" class="relative px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in requirements" :key="item.id">
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.bmi_category }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.is_pregnant ? 'Ya' : 'Tidak' }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.trimester ?? '-' }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.calories }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.protein }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.carbohydrates }}
              </td>
              <td
                class="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ item.fat }}
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
                    @click="openDeleteModal(item)"
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
        editing ? 'Edit Target Nutrisi' : 'Tambah Target Nutrisi'
      }}</template>
      <div class="p-4 space-y-4">
        <select v-model="form.bmi_category" class="w-full input">
          <option value="">Pilih Kategori BMI</option>
          <option v-for="cat in bmiOptions" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <div class="mb-4">
          <label
            for="is-pregnant-toggle"
            class="flex items-center justify-between cursor-pointer"
          >
            <span class="text-base font-medium text-gray-700">
              Apakah Untuk Ibu **Hamil**?
            </span>

            <div class="relative">
              <input
                type="checkbox"
                id="is-pregnant-toggle"
                v-model="form.is_pregnant"
                class="sr-only"
              />
              <div class="block h-8 bg-gray-300 rounded-full w-14"></div>
              <div
                class="absolute w-6 h-6 transition bg-white rounded-full dot left-1 top-1"
                :class="{
                  'transform translate-x-6 bg-blue-600': form.is_pregnant,
                  'bg-gray-500': !form.is_pregnant,
                }"
              ></div>
            </div>
          </label>
        </div>

        <div v-if="form.is_pregnant" class="mb-4">
          <label
            for="trimester-select"
            class="block mb-1 text-sm font-medium text-gray-700"
          >
            Pilih Trimester Kehamilan
          </label>
          <select
            id="trimester-select"
            v-model="form.trimester"
            class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-10"
          >
            <option value="" disabled :selected="!form.trimester">
              --- Pilih Trimester ---
            </option>
            <option :value="1">Trimester 1</option>
            <option :value="2">Trimester 2</option>
            <option :value="3">Trimester 3</option>
          </select>
        </div>

        <input
          v-model="form.calories"
          type="number"
          class="w-full input"
          placeholder="Kalori"
        />
        <input
          v-model="form.protein"
          type="number"
          class="w-full input"
          placeholder="Protein"
        />
        <input
          v-model="form.carbohydrates"
          type="number"
          class="w-full input"
          placeholder="Karbohidrat"
        />
        <input
          v-model="form.fat"
          type="number"
          class="w-full input"
          placeholder="Lemak"
        />

        <div class="flex justify-end gap-3 pt-2">
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
      <template #title>Hapus Target Nutrisi</template>
      <div class="p-4">
        Yakin ingin menghapus target untuk kategori
        <strong>{{ selected?.bmi_category }}</strong>
        {{ selected?.is_pregnant ? `(Trimester ${selected?.trimester})` : '' }}?
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 text-white bg-gray-400 rounded"
          >
            Batal
          </button>
          <button
            @click="deleteRequirement"
            class="px-4 py-2 text-white bg-red-500 rounded"
          >
            Hapus
          </button>
        </div>
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

const requirements = ref([]);
const loading = ref(false);

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref(false);
const selected = ref(null);

const bmiOptions = ['underweight', 'normal', 'overweight', 'obese'];

const form = ref({
  bmi_category: '',
  is_pregnant: false,
  trimester: null,
  calories: '',
  protein: '',
  carbohydrates: '',
  fat: '',
});

// Fetch data
async function fetchRequirements() {
  loading.value = true;
  try {
    const res = await axios.get('/nutrition-requirement');
    requirements.value = res.data.data;
  } catch (err) {
    toast.error('Gagal memuat data nutrisi');
  } finally {
    loading.value = false;
  }
}

// Modal handlers
function openCreateModal() {
  editing.value = false;
  form.value = {
    bmi_category: '',
    is_pregnant: false,
    trimester: null,
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
  };
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
    const payload = { ...form.value };
    if (!payload.is_pregnant) {
      payload.trimester = null;
    }

    if (editing.value) {
      await axios.put(`/nutrition-requirement/${selected.value.id}`, payload);
      toast.success('Data berhasil diperbarui');
    } else {
      await axios.post('/nutrition-requirement', payload);
      toast.success('Data berhasil ditambahkan');
    }

    closeFormModal();
    fetchRequirements();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menyimpan data');
  }
}

// Delete
async function deleteRequirement() {
  try {
    await axios.delete(`/nutrition-requirement/${selected.value.id}`);
    toast.success('Data berhasil dihapus');
    closeDeleteModal();
    fetchRequirements();
  } catch (err) {
    toast.error('Gagal menghapus data');
  }
}

onMounted(fetchRequirements);
</script>

<style scoped>
.dot {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

#is-pregnant-toggle:checked ~ .block {
  background-color: #3b82f6;
}
</style>
