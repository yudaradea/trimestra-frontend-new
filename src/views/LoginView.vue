<template>
  <!-- FULL-VIEWPORT MOBILE -->
  <div class="flex justify-center min-h-screen bg-gray-50">
    <div
      class="flex flex-col w-full max-w-md min-h-screen text-gray-800 bg-white"
    >
      <!-- CONTENT tengah -->
      <div class="flex flex-col justify-center flex-1 px-6">
        <!-- IMAGE HEADER -->
        <div class="flex justify-center">
          <div>
            <img src="@/assets/login.png" alt="Ilustrasi" class="w-48" />
          </div>
        </div>

        <!-- TEXT HEADER -->
        <div class="mt-6 text-center">
          <h1 class="text-xl font-bold text-teal-600">Selamat Datang</h1>
          <p class="mt-2 text-sm text-gray-600">
            Trimestra adalah aplikasi sahabat sehat<br />perjalanan kehamilanmu!
          </p>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleLogin" class="mt-8 space-y-4">
          <!-- Error Message -->
          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>

          <!-- Email -->
          <div class="relative">
            <input
              v-model="formData.email"
              type="email"
              required
              placeholder="Email"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Password"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
            <button
              type="button"
              class="absolute inset-y-0 flex items-center text-gray-400 right-3"
              @click="togglePassword"
            >
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
            </button>
          </div>

          <!-- Forgot -->
          <div class="text-right">
            <a href="#" class="text-xs text-gray-500">Lupa password?</a>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 font-semibold text-white bg-teal-600 rounded-full disabled:opacity-60"
          >
            {{ loading ? 'Memuat...' : 'Masuk' }}
          </button>
        </form>

        <!-- FOOTER -->
        <div class="pt-6 pb-4 text-sm text-center">
          Belum punya akun?
          <router-link to="/register" class="font-semibold text-teal-600">
            Daftar
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const formData = reactive({ email: '', password: '' });
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleLogin(event) {
  if (event) event.preventDefault();

  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(formData);
    toast.success('Login berhasil!');

    // cek user apakah punya profile
    await authStore.fetchUser();

    // cek apakah dia admin
    if (authStore.user.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    if (!authStore.user.profile) {
      router.push('/profile-setup');
      return;
    }

    // Redirect ke halaman yang dituju sebelumnya (jika ada)
    const redirect = router.currentRoute.value.query.redirect || '/';
    router.push(redirect);
  } catch (e) {
    const msg = e.response?.data?.message || 'Login gagal';
    errorMessage.value = msg;
    toast.error(msg);
    console.error('Login error:', e);
  } finally {
    loading.value = false;
  }
}
</script>
