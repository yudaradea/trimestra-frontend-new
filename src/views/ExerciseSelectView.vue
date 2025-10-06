<template>
  <div class="max-w-md min-h-screen pb-20 mx-auto bg-white">
    <Header title="Exercise" showBack />

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat data exercise...</span>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Tombol Tambah User Exercise -->
      <div class="p-4">
        <button
          @click="openUserExerciseModal()"
          class="w-full py-3 text-white rounded-lg shadow-md bg-primary"
        >
          + Tambah Exercise Saya
        </button>
      </div>

      <!-- Exercise Bawaan -->
      <div class="p-4">
        <h3 class="mb-2 font-semibold">Exercise Tersedia</h3>
        <div
          v-for="ex in exercises"
          :key="ex.id"
          class="p-3 mb-2 border rounded-lg"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ ex.name }}</p>
              <p class="text-xs text-gray-500">
                {{ ex.calories_burned_per_minute }} kcal / menit
              </p>
            </div>
            <button
              @click="selectExercise(ex, false)"
              class="px-3 py-1 text-sm text-white rounded-lg bg-primary"
            >
              Pilih
            </button>
          </div>
        </div>
        <button
          v-if="hasMoreExercises"
          @click="loadMoreExercises"
          class="w-full py-2 text-white rounded-lg bg-primary"
        >
          Load More
        </button>
      </div>

      <!-- User Exercise -->
      <div class="p-4">
        <h3 class="mb-2 font-semibold">Exercise Saya</h3>
        <div
          v-for="ex in userExercises"
          :key="ex.id"
          class="p-3 mb-2 border rounded-lg"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ ex.name }}</p>
              <p class="text-xs text-gray-500">
                {{ ex.calories_burned_per_minute }} kcal / menit
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="selectExercise(ex, true)"
                class="px-3 py-1 text-sm text-white rounded-lg bg-primary"
              >
                Pilih
              </button>
              <button
                @click="editUserExercise(ex)"
                class="px-3 py-1 text-sm text-white rounded-lg bg-primary"
              >
                Edit
              </button>
              <button
                @click="deleteUserExercise(ex.id)"
                class="px-3 py-1 text-sm text-white bg-red-500 rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
        <button
          v-if="hasMoreUserExercises"
          @click="loadMoreUserExercises"
          class="w-full py-2 text-white rounded-lg bg-primary"
        >
          Load More
        </button>
      </div>

      <!-- Input Durasi -->
      <div v-if="selectedExercise" class="p-4">
        <div class="p-3 border rounded-lg">
          <h4 class="mb-2 font-semibold">
            Durasi untuk exercise {{ selectedExercise.name }}
          </h4>
          <input
            v-model.number="duration"
            type="number"
            placeholder="Durasi (menit)"
            class="w-full p-2 mb-2 border rounded-lg"
          />
          <p class="mb-2 text-sm text-gray-500">
            Total terbakar:
            {{ (selectedExercise.calories_burned_per_minute || 0) * duration }}
            kcal
          </p>
          <button
            @click="submitExercise"
            class="w-full py-2 text-white rounded-lg bg-primary"
          >
            Tambahkan ke Diary
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit User Exercise -->
    <Modal :show="showUserExerciseModal" @close="closeUserExerciseModal">
      <div class="p-4 space-y-3">
        <h3 class="mb-4 text-lg font-semibold">
          {{
            editingUserExercise ? 'Edit Exercise Saya' : 'Tambah Exercise Saya'
          }}
        </h3>
        <form @submit.prevent="saveUserExercise" class="space-y-3">
          <input
            v-model="userExercise.name"
            placeholder="Nama Exercise"
            class="input"
            required
          />
          <input
            v-model.number="userExercise.calories_burned_per_minute"
            type="number"
            placeholder="Kalori terbakar per menit"
            class="input"
            required
          />
          <input
            v-model="userExercise.jenis"
            placeholder="Jenis (Cardio/Strength)"
            class="input"
            required
          />
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeUserExerciseModal"
              class="px-3 py-1 border rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1 text-white rounded-lg bg-primary"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Header from '@/components/Header.vue';
import Modal from '@/components/Modal.vue';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const loading = ref(true);

const exercises = ref([]);
const userExercises = ref([]);
const selectedExercise = ref(null);
const duration = ref(0);

// Pagination state
const exercisePage = ref(1);
const userExercisePage = ref(1);
const rowPerPage = 10;
const hasMoreExercises = ref(false);
const hasMoreUserExercises = ref(false);

// Modal user exercise
const showUserExerciseModal = ref(false);
const editingUserExercise = ref(null);
const userExercise = ref({
  name: '',
  calories_burned_per_minute: null,
  jenis: '',
});

// Fetch exercise bawaan
const fetchExercises = async (append = false) => {
  try {
    const params = { row_per_page: rowPerPage, page: exercisePage.value };
    const res = await api.get('/exercise/all/paginated', { params });
    const items = res.data.data.data || res.data.data;
    if (append) exercises.value = [...exercises.value, ...items];
    else exercises.value = items;
    const pagination = res.data.data;
    hasMoreExercises.value =
      pagination.meta.current_page < pagination.meta.last_page;
  } catch (err) {
    toast.error('Gagal memuat makanan');
    console.error(err);
  }
};

//  Fetch user exercise
const fetchUserExercises = async (append = false) => {
  try {
    const params = { row_per_page: rowPerPage, page: userExercisePage.value };
    const res = await api.get('/user-exercise/all/paginated', { params });
    const items = res.data.data.data || res.data.data;
    console.log(items);
    if (append) userExercises.value = [...userExercises.value, ...items];
    else userExercises.value = items;
    const pagination = res.data.data;
    hasMoreUserExercises.value =
      pagination.meta.current_page < pagination.meta.last_page;
  } catch (err) {
    toast.error('Gagal memuat makanan');
    console.error(err);
  }
};

const loadMoreExercises = () => {
  exercisePage.value++;
  fetchExercises(true);
};
const loadMoreUserExercises = () => {
  userExercisePage.value++;
  fetchUserExercises(true);
};

// Select exercise
const selectExercise = (ex, isUser = false) => {
  selectedExercise.value = { ...ex, isUser };
};

// Modal user exercise
const openUserExerciseModal = () => {
  editingUserExercise.value = null;
  userExercise.value = {
    name: '',
    calories_burned_per_minute: null,
    jenis: '',
  };
  showUserExerciseModal.value = true;
};
const closeUserExerciseModal = () => {
  showUserExerciseModal.value = false;
};

// Edit user exercise
const editUserExercise = (ex) => {
  editingUserExercise.value = ex.id;
  userExercise.value = { ...ex };
  showUserExerciseModal.value = true;
};

// Save user exercise (create or update)
const saveUserExercise = async () => {
  try {
    if (editingUserExercise.value) {
      await api.put(
        `/user-exercise/${editingUserExercise.value}`,
        userExercise.value
      );
      toast.success('Exercise custom berhasil diupdate');
    } else {
      await api.post('/user-exercise', userExercise.value);
      toast.success('Exercise custom berhasil ditambahkan');
    }
    showUserExerciseModal.value = false;
    // refresh list
    userExercisePage.value = 1;
    fetchUserExercises();
  } catch (err) {
    toast.error('Gagal menyimpan exercise custom');
    console.error(err);
  }
};

// Delete user exercise
const deleteUserExercise = async (id) => {
  if (!confirm('Hapus exercise ini?')) return;
  try {
    await api.delete(`/user-exercise/${id}`);
    toast.success('Exercise custom berhasil dihapus');
    userExercisePage.value = 1;
    fetchUserExercises();
  } catch (err) {
    toast.error('Gagal menghapus exercise custom');
    console.error(err);
  }
};

// Submit ke /exercise-log
const submitExercise = async () => {
  if (!duration.value) {
    toast.error('Durasi wajib diisi');
    return;
  }
  try {
    const payload = {
      duration: duration.value,
      date: route.query.date,
    };

    if (selectedExercise.value.isUser) {
      payload.user_exercise_id = selectedExercise.value.id; // ✅ pakai id user exercise
    } else {
      payload.exercise_id = selectedExercise.value.id; // ✅ pakai id exercise bawaan
    }

    await api.post('/exercise-log', payload);
    toast.success('Exercise berhasil ditambahkan');
    router.push('/diary');
  } catch (err) {
    toast.error('Gagal menambahkan exercise');
    console.error(err);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchExercises(), fetchUserExercises()]);
  } finally {
    loading.value = false;
  }
});
</script>
