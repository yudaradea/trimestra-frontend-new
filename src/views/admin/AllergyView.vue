<template>
  <Layout title="Manajemen Alergi">
    <div class="p-6 bg-white rounded shadow">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Daftar Alergi</h2>
        <button
          @click="openCreateModal"
          class="px-4 py-2 text-white bg-teal-500 rounded hover:bg-teal-600"
        >
          Tambah Alergi
        </button>
      </div>

      <div v-if="loading" class="py-6 text-center">⏳ Memuat data...</div>

      <table v-else class="w-full text-sm border">
        <thead class="text-left bg-gray-100">
          <tr>
            <th class="p-2 border-b">#</th>
            <th class="p-2 border-b">Nama Alergi</th>
            <th class="w-32 p-2 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in allergies" :key="item.name">
            <td class="p-2 border-b">{{ index + 1 }}</td>
            <td class="p-2 border-b">{{ item.name }}</td>
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
