<template>
  <Layout title="Manajemen Latihan">
    <div class="">
      <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-xl font-semibold">List Exercises</h2>
          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="openCreateModal"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <span>➕</span>
              Tambah Latihan
            </button>
          </div>
        </div>

        <!-- Filter -->
        <div class="flex flex-wrap items-center justify-end gap-3">
          <div class="flex items-center gap-2">
            <label for="perPage" class="text-sm text-gray-600">Tampilkan</label>
            <select
              id="perPage"
              v-model="rowPerPage"
              @change="fetchExercises(1)"
              class="py-2 pl-3 pr-8 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <!-- Search -->
          <div class="relative">
            <input
              v-model="search"
              @input="fetchExercises(1)"
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

          <div class="flex items-center w-48 h-auto">
            <select
              v-model="filterJenis"
              @change="fetchExercises(1)"
              class="w-full py-2 pl-3 pr-8 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Semua Jenis</option>
              <option v-for="j in jenisList" :key="j" :value="j">
                {{ j }}
              </option>
            </select>
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
      <div v-else class="mt-8 border border-gray-200 rounded-lg shadow-sm">
        <div class="overflow-x-auto rounded-lg">
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
                  scope="col"
                  class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Nama
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Jenis
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Kalori Terbakar/menit
                </th>
                <th scope="col" class="relative px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in exercises" :key="item.id">
                <td
                  class="px-6 py-6 text-sm font-medium text-gray-900 whitespace-nowrap"
                >
                  {{ index + 1 + (meta.current_page - 1) * meta.per_page }}
                </td>
                <td
                  class="px-6 py-6 text-sm font-medium text-gray-900 whitespace-nowrap"
                >
                  {{ item.name }}
                </td>
                <td
                  class="px-6 py-6 text-sm font-medium text-gray-900 whitespace-nowrap"
                >
                  {{ item.jenis }}
                </td>
                <td
                  class="px-6 py-6 text-sm font-medium text-gray-900 whitespace-nowrap"
                >
                  {{ item.calories_burned_per_minute }}
                </td>
                <td class="flex items-center justify-center gap-2 px-4 py-4">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- pagination -->
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
            @click="fetchExercises(meta.current_page - 1)"
            class="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          <!-- tampilkan halaman yang terlihat -->
          <template v-for="(page, i) in visiblePages" :key="i">
            <button
              v-if="page !== '...'"
              @click="fetchExercises(page)"
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
            @click="fetchExercises(meta.current_page + 1)"
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
        editing ? 'Edit Latihan' : 'Tambah Latihan'
      }}</template>

      <div class="space-y-4">
        <div class="space-y-3">
          <input
            v-model="form.name"
            type="text"
            class="w-full input"
            placeholder="Nama latihan"
          />
          <select name="" id="" v-model="form.jenis" class="w-full input">
            <option value="" v-if="!editing">Pilih Jenis</option>
            <option value="Cardio">Cardio</option>
            <option value="Strength">Strength</option>
            <option value="Flexibility">Flexibility</option>
          </select>
          <input
            v-model="form.calories_burned_per_minute"
            type="number"
            step="0.1"
            class="w-full input"
            placeholder="Kalori/menit"
          />
          <input
            v-model="form.video_url"
            type="url"
            class="w-full input"
            placeholder="URL Video, ex: https://www.youtube.com/watch?v=..."
          />
          <textarea
            v-model="form.description"
            class="w-full input"
            rows="3"
            placeholder="Deskripsi"
          ></textarea>
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
      <template #title>Hapus Latihan</template>

      <p>
        Yakin ingin menghapus latihan <strong>{{ selected?.name }}</strong
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
          @click="deleteExercise"
          class="px-4 py-2 text-white bg-red-500 rounded"
        >
          Hapus
        </button>
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Layout from '@/components/admin/Layout.vue';
import Modal from '@/components/Modal.vue';

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

const exercises = ref([]);
const meta = ref({});
const rowPerPage = ref(10);
const loading = ref(false);
const search = ref('');

const filterJenis = ref('');
const jenisList = ref(['Cardio', 'Strength', 'Flexibility']); // bisa diisi dinamis kalau ada endpoint jenis

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref(false);
const selected = ref(null);

const form = ref({
  name: '',
  jenis: '',
  calories_burned_per_minute: '',
  video_url: '',
  description: '',
  is_active: true,
});

// Fetch exercises
async function fetchExercises(page = 1) {
  loading.value = true;
  try {
    const res = await axios.get('/exercise/all/paginated', {
      params: {
        row_per_page: rowPerPage.value,
        page,
        search: search.value,
        jenis: filterJenis.value || undefined,
      },
    });
    exercises.value = res.data.data.data;
    meta.value = res.data.data.meta;
  } catch (err) {
    toast.error('Gagal memuat data latihan');
  } finally {
    loading.value = false;
  }
}

// Modal handlers
function openCreateModal() {
  editing.value = false;
  form.value = {
    name: '',
    jenis: '',
    calories_burned_per_minute: '',
    video_url: '',
    description: '',
    is_active: true,
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

// Submit create/edit
async function submitForm() {
  try {
    if (editing.value) {
      await axios.put(`/exercise/${selected.value.id}`, form.value);
      toast.success('Latihan berhasil diperbarui');
    } else {
      await axios.post('/exercise', form.value);
      toast.success('Latihan berhasil ditambahkan');
    }
    closeFormModal();
    fetchExercises(meta.value.current_page || 1);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menyimpan latihan');
  }
}

// Delete
async function deleteExercise() {
  try {
    await axios.delete(`/exercise/${selected.value.id}`);
    toast.success('Latihan berhasil dihapus');
    closeDeleteModal();
    fetchExercises(meta.value.current_page || 1);
  } catch (err) {
    toast.error('Gagal menghapus latihan');
  }
}

onMounted(() => {
  fetchExercises();
});
</script>
