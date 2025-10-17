<template>
  <Layout title="Target Nutrisi">
    <div class="p-6 bg-white rounded shadow">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Daftar Target Nutrisi</h2>
        <button
          @click="openCreateModal"
          class="px-4 py-2 text-white bg-teal-500 rounded hover:bg-teal-600"
        >
          Tambah Target
        </button>
      </div>

      <div v-if="loading" class="py-6 text-center">⏳ Memuat data...</div>

      <table v-else class="w-full text-sm border">
        <thead class="text-left bg-gray-100">
          <tr>
            <th class="p-2 border-b">Kategori BMI</th>
            <th class="p-2 border-b">Hamil</th>
            <th class="p-2 border-b">Trimester</th>
            <th class="p-2 border-b">Kalori</th>
            <th class="p-2 border-b">Protein</th>
            <th class="p-2 border-b">Karbohidrat</th>
            <th class="p-2 border-b">Lemak</th>
            <th class="w-32 p-2 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in requirements" :key="item.id">
            <td class="p-2 border-b">{{ item.bmi_category }}</td>
            <td class="p-2 border-b">{{ item.is_pregnant ? 'Ya' : 'Tidak' }}</td>
            <td class="p-2 border-b">{{ item.trimester ?? '-' }}</td>
            <td class="p-2 border-b">{{ item.calories }}</td>
            <td class="p-2 border-b">{{ item.protein }}</td>
            <td class="p-2 border-b">{{ item.carbohydrates }}</td>
            <td class="p-2 border-b">{{ item.fat }}</td>
            <td class="p-2 border-b">
              <div class="flex gap-2">
                <button @click="openEditModal(item)" class="px-2 py-1 text-white rounded bg-primary">Edit</button>
                <button @click="openDeleteModal(item)" class="px-2 py-1 text-white bg-red-500 rounded">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Create/Edit -->
    <Modal :show="showFormModal" @close="closeFormModal">
      <template #title>{{ editing ? 'Edit Target Nutrisi' : 'Tambah Target Nutrisi' }}</template>
      <div class="p-4 space-y-4">
        <select v-model="form.bmi_category" class="w-full input">
          <option value="">Pilih Kategori BMI</option>
          <option v-for="cat in bmiOptions" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <div class="mb-4">
            <label for="is-pregnant-toggle" class="flex items-center justify-between cursor-pointer">
                <span class="text-base font-medium text-gray-700">
                Apakah Untuk Ibu **Hamil**?
                </span>
                
                <div class="relative">
                <input 
                    type="checkbox" 
                    id="is-pregnant-toggle" 
                    v-model="form.is_pregnant" 
                    class="sr-only"
                >
                <div class="block h-8 bg-gray-300 rounded-full w-14"></div>
                <div 
                    class="absolute w-6 h-6 transition bg-white rounded-full dot left-1 top-1"
                    :class="{ 'transform translate-x-6 bg-blue-600': form.is_pregnant, 'bg-gray-500': !form.is_pregnant }"
                ></div>
                </div>
            </label>
        </div>

        <div v-if="form.is_pregnant" class="mb-4">
        <label for="trimester-select" class="block mb-1 text-sm font-medium text-gray-700">
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

        <input v-model="form.calories" type="number" class="w-full input" placeholder="Kalori" />
        <input v-model="form.protein" type="number" class="w-full input" placeholder="Protein" />
        <input v-model="form.carbohydrates" type="number" class="w-full input" placeholder="Karbohidrat" />
        <input v-model="form.fat" type="number" class="w-full input" placeholder="Lemak" />

        <div class="flex justify-end gap-3 pt-2">
          <button @click="closeFormModal" class="px-4 py-2 text-white bg-gray-400 rounded">Batal</button>
          <button @click="submitForm" class="px-4 py-2 text-white rounded bg-primary">
            {{ editing ? 'Simpan Perubahan' : 'Tambah' }}
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal Delete -->
    <Modal :show="showDeleteModal" @close="closeDeleteModal">
      <template #title>Hapus Target Nutrisi</template>
      <div class="p-4">
        Yakin ingin menghapus target untuk kategori <strong>{{ selected?.bmi_category }}</strong>
        {{ selected?.is_pregnant ? `(Trimester ${selected?.trimester})` : '' }}?
        <div class="flex justify-end gap-3 pt-4">
          <button @click="closeDeleteModal" class="px-4 py-2 text-white bg-gray-400 rounded">Batal</button>
          <button @click="deleteRequirement" class="px-4 py-2 text-white bg-red-500 rounded">Hapus</button>
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