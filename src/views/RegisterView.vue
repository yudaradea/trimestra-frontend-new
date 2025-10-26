<template>
  <div class="flex justify-center min-h-screen bg-gray-50">
    <!-- SCROLLABLE WRAPPER -->
    <div
      class="flex flex-col w-full max-w-md px-6 py-6 overflow-y-auto bg-white"
    >
      <!-- CENTER CONTENT -->
      <div class="flex flex-col justify-center flex-1">
        <!-- IMAGE HEADER -->
        <div class="flex justify-center mb-6">
          <img
            src="@/assets/register.png"
            alt="Register Illustration"
            class="object-contain w-52 h-52"
          />
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Nama -->
          <input
            v-model="formData.name"
            type="text"
            required
            placeholder="Nama Lengkap"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />

          <!-- Email -->
          <input
            v-model="formData.email"
            type="email"
            required
            placeholder="Email"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />

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
              @click="showPassword = !showPassword"
              class="absolute text-gray-500 right-3 top-3"
            >
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
            </button>
          </div>

          <!-- Konfirmasi Password -->
          <div class="relative">
            <input
              v-model="formData.password_confirmation"
              :type="showConfirm ? 'text' : 'password'"
              required
              placeholder="Konfirmasi Password"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
            <button
              type="button"
              @click="showConfirm = !showConfirm"
              class="absolute text-gray-500 right-3 top-3"
            >
              <i :class="showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
            </button>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 font-semibold text-white bg-teal-600 rounded-full shadow hover:bg-teal-700 disabled:opacity-60"
          >
            {{ loading ? 'Memuat...' : 'Daftar' }}
          </button>
        </form>

        <!-- FOOTER -->
        <div class="mt-6 text-sm text-center">
          Sudah punya akun?
          <router-link to="/login" class="font-semibold text-teal-600"
            >Masuk</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const showPassword = ref(false);
const showConfirm = ref(false);
const loading = ref(false);

const handleRegister = async () => {
  if (formData.value.password !== formData.value.password_confirmation) {
    toast.error('Password dan konfirmasi password tidak sama');
    return;
  }

  loading.value = true;
  try {
    await authStore.register(formData.value);
    toast.success('Registrasi berhasil!');
    router.push('/register-success');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registrasi gagal');
  } finally {
    loading.value = false;
  }
};
</script>
