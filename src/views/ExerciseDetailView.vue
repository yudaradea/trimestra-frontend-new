<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <Header title="Detail Latihan" showBack />

    <div
      v-if="loading"
      class="flex items-center justify-center min-h-[80vh] py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
    </div>

    <div v-else class="px-4 py-6 space-y-6">
      <!-- Info Latihan -->
      <h2 class="text-xl font-bold text-gray-800">{{ exercise.name }}</h2>
      <p class="text-sm text-gray-600">
        🔥 {{ exercise.calories_burned_per_minute }} kalori/menit
      </p>
      <p class="text-xs italic text-gray-500">Jenis: {{ exercise.jenis }}</p>

      <iframe
        :src="youtubeEmbedUrl(exercise.video_url)"
        frameborder="0"
        allowfullscreen
        class="w-full h-56 rounded-xl"
      ></iframe>

      <p class="text-sm text-gray-700">{{ exercise.description }}</p>

      <!-- Tambahkan ke Diary -->
      <div class="flex items-center justify-between pt-4">
        <p class="text-sm font-medium text-gray-800">
          Tambahkan latihan
          <span class="font-semibold text-primary">{{ exercise.name }}</span> ke
          diary
        </p>
        <button
          @click="showModal = true"
          class="flex items-center justify-center w-8 h-8 text-xl font-bold rounded-full bg-primary"
        >
          <i class="text-xl text-white ri-add-line"></i>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <Modal :show="showModal" @close="showModal = false">
      <div>
        <h3 class="mb-2 text-lg font-bold text-gray-800">
          {{ exercise.name }}
        </h3>

        <label class="block mb-1 text-sm font-medium">Durasi (menit)</label>
        <input type="number" v-model.number="duration" min="1" class="input" />

        <p class="text-sm text-gray-600">
          Total kalori:
          <span class="font-semibold text-primary"
            >{{ totalCalories }} kal</span
          >
        </p>

        <button
          @click="addToDiary"
          class="w-full py-2 mt-4 text-white rounded bg-primary hover:bg-primary/80"
          :disabled="duration.length === 0"
          :class="{
            'opacity-50 cursor-not-allowed': duration.length === 0,
          }"
        >
          Tambahkan ke Diary
        </button>
      </div>
    </Modal>
  </div>
  <BottomNav />
</template>

<script setup>
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/lib/axios';
import { useToast } from 'vue-toastification';
import Modal from '@/components/Modal.vue';

const route = useRoute();
const toast = useToast();

const exercise = ref(null);
const duration = ref(30);
const loading = ref(true);
const showModal = ref(false);
const currentDate = ref(new Date());

const formatDate = (date) => {
  const d = date ? (date instanceof Date ? date : new Date(date)) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const diaryDate = computed(() => formatDate(currentDate.value));

const fetchDetail = async () => {
  try {
    const res = await api.get(`/exercise/${route.params.id}`);
    exercise.value = res.data.data;
  } catch (err) {
    toast.error('Gagal memuat detail latihan');
  } finally {
    loading.value = false;
  }
};

const addToDiary = async () => {
  try {
    await api.post('/exercise-log', {
      exercise_id: exercise.value.id,
      duration: duration.value,
      date: diaryDate.value,
    });
    toast.success('Latihan berhasil ditambahkan ke diary!');
    showModal.value = false;
  } catch (err) {
    toast.error('Gagal menambahkan ke diary');
    console.error(err);
  }
};

const totalCalories = computed(() => {
  if (!exercise.value) return 0;
  return exercise.value.calories_burned_per_minute * duration.value;
});

const youtubeEmbedUrl = (url) => {
  const videoId = url.split('v=')[1]?.split('&')[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

onMounted(() => {
  fetchDetail();
});
</script>
