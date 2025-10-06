<template>
  <div class="max-w-md min-h-screen pb-20 mx-auto bg-white">
    <!-- Header -->
    <Header title="Pengaturan Password" showBack />

    <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
      <!-- Password Saat Ini -->
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">
          Password Saat Ini
        </label>
        <div class="relative">
          <input
            :type="showCurrent ? 'text' : 'password'"
            v-model="form.current_password"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            required
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 text-gray-500"
            @click="showCurrent = !showCurrent"
          >
            <i :class="showCurrent ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
          </button>
        </div>
      </div>

      <!-- Password Baru -->
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">
          Password Baru
        </label>
        <div class="relative">
          <input
            :type="showNew ? 'text' : 'password'"
            v-model="form.new_password"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            required
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 text-gray-500"
            @click="showNew = !showNew"
          >
            <i :class="showNew ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
          </button>
        </div>
      </div>

      <!-- Konfirmasi Password -->
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">
          Konfirmasi Password
        </label>
        <div class="relative">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="form.new_password_confirmation"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            required
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 text-gray-500"
            @click="showConfirm = !showConfirm"
          >
            <i :class="showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
          </button>
        </div>
      </div>

      <!-- Tombol Simpan -->
      <button
        type="submit"
        class="w-full py-3 bg-primary text-white rounded-lg font-semibold active:scale-[0.98] transition"
        :disabled="auth.loading"
      >
        {{ auth.loading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </form>
  </div>

  <BottomNav />
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const form = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const handleSubmit = async () => {
  if (form.new_password !== form.new_password_confirmation) {
    toast.error('Konfirmasi password tidak cocok');
    return;
  }
  try {
    await auth.changePassword(form);
    toast.success(
      'Password berhasil diubah. Silakan login dengan password baru'
    );
    router.push('/login');
  } catch (e) {
    toast.error(e.message || 'Gagal mengubah password');
  }
};
</script>
