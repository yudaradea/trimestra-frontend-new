<template>
  <Layout title="Manajemen Latihan">
    <div class="p-6 bg-white rounded shadow">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">List Exercises</h2>
        <button
          @click="openCreateModal"
          class="px-4 py-2 text-white bg-teal-500 rounded hover:bg-teal-600"
        >
          Tambah Latihan
        </button>
      </div>

      <!-- Filter -->
      <div class="flex items-center gap-4 mb-4 w-52">
        <select v-model="filterJenis" @change="fetchExercises(1)" class="input">
          <option value="">Semua Jenis</option>
          <option v-for="j in jenisList" :key="j" :value="j">{{ j }}</option>
        </select>
      </div>

      <!-- Table -->
      <div v-if="loading" class="py-6 text-center">⏳ Memuat data...</div>
      <table v-else class="w-full text-sm border">
        <thead class="text-left bg-gray-100">
          <tr>
            <th class="p-2 border-b">No</th>
            <th class="p-2 border-b">Nama</th>
            <th class="p-2 border-b">Jenis</th>
            <th class="p-2 border-b">Kalori Terbakar/menit</th>
            <th class="w-32 p-2 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in exercises" :key="item.id">
            <td class="p-2 border-b">
              {{ index + 1 + (meta.current_page - 1) * meta.per_page }}
            </td>
            <td class="p-2 border-b">{{ item.name }}</td>
            <td class="p-2 border-b">{{ item.jenis }}</td>
            <td class="p-2 border-b">{{ item.calories_burned_per_minute }}</td>
            <td class="p-2 border-b">
              <div class="flex gap-2">
                <button
                  @click="openEditModal(item)"
                  class="px-3 py-1 text-white rounded bg-primary"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(item)"
                  class="px-3 py-1 text-white bg-red-500 rounded"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="flex justify-end gap-2 mt-4">
        <button
          v-for="page in meta.last_page"
          :key="page"
          @click="fetchExercises(page)"
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
       <button @click="closeDeleteModal" class="px-4 py-2 text-white bg-gray-400 rounded">Batal</button>
      <button @click="deleteExercise" class="px-4 py-2 text-white bg-red-500 rounded">Hapus</button>
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

const exercises = ref([]);
const meta = ref({});
const rowPerPage = ref(10);
const loading = ref(false);

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
