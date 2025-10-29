<template>
  <!-- FULL-VIEWPORT MOBILE: Dark background for contrast -->
  <div class="flex justify-center min-h-screen bg-gray-50">
    <div
      class="flex flex-col w-full max-w-md min-h-screen text-gray-800 bg-white"
    >
      <!-- HEADER -->
      <div class="relative p-6 bg-white border-b border-gray-100">
        <button
          @click="router.back()"
          class="absolute text-xl text-teal-600 transition duration-150 transform -translate-y-1/2 left-4 top-1/2 hover:text-teal-700"
        >
          <i class="ri-arrow-left-line"></i>
        </button>
        <h1 class="text-xl font-bold text-center text-gray-900">
          Lupa Kata Sandi
        </h1>
      </div>

      <!-- CONTENT CARD -->
      <div class="flex flex-col flex-1 px-8 pt-10 pb-12">
        <div class="mb-10 text-center">
          <!-- Icon (Key/Lock) for visual appeal -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-16 h-16 mx-auto mb-4 text-teal-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h2 class="mb-2 text-xl font-semibold text-gray-900">
            Pemulihan Akun
          </h2>
          <p class="text-sm leading-relaxed text-gray-600">
            Masukkan email Anda untuk menerima PIN verifikasi yang dikirim ke
            <span class="font-bold text-teal-600">TRIMESTRA</span>.
          </p>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleForgot" class="space-y-6">
          <!-- Error Message -->
          <p
            v-if="errorMessage"
            class="p-3 text-sm font-medium text-center text-red-700 border border-red-200 rounded-lg bg-red-50"
          >
            {{ errorMessage }}
          </p>

          <!-- Email Input -->
          <div>
            <label
              for="email-input"
              class="block mb-1 text-sm font-medium text-gray-700"
              >Email Akun</label
            >
            <input
              id="email-input"
              v-model="email"
              type="email"
              required
              placeholder="contoh@email.com"
              class="w-full px-4 py-3 text-base transition duration-200 bg-white border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 mt-8 font-extrabold text-white transition-all duration-300 rounded-lg shadow-lg shadow-teal-500/30 disabled:opacity-50 disabled:shadow-none bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 active:bg-teal-800"
          >
            {{ loading ? 'Mengirim...' : 'Kirim PIN Verifikasi' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Asumsi Anda menggunakan Toastification, jadi ini dipertahankan
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const toast = useToast();
const store = useAuthStore();

const email = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function handleForgot() {
  loading.value = true;
  errorMessage.value = '';

  try {
    // Pastikan store.forgotPassword() dapat menangani error dengan baik
    await store.forgotPassword(email.value);
    toast.success(
      'PIN verifikasi telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.'
    );
    router.push('/verify-pin');
  } catch (e) {
    // Penanganan error yang lebih informatif
    const msg =
      e.response?.data?.message ||
      'Gagal mengirim PIN. Periksa koneksi atau email Anda.';
    errorMessage.value = msg;
    toast.error(msg);
  } finally {
    loading.value = false;
  }
}
</script>
