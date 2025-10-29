<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

// --- State for enhancements ---
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const verifiedPin = ref(null);

// Ambil PIN dari localStorage saat komponen dimuat
onMounted(() => {
  const pin = localStorage.getItem('verifiedPin');
  if (pin) {
    verifiedPin.value = pin;
  } else {
    // Jika PIN hilang (misalnya user refresh halaman atau kedaluwarsa),
    // arahkan kembali untuk memulai proses ulang.
    toast.error(
      'Token otorisasi hilang. Silakan ulangi proses verifikasi PIN.'
    );
    router.replace('/forgot-password');
  }
});

const togglePassword = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'confirm') {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

const handleReset = async () => {
  // Validasi PIN di sisi klien (sebelum mengirim request)
  if (!verifiedPin.value) {
    toast.error(
      'PIN verifikasi tidak ditemukan. Mengarahkan Anda untuk memulai ulang proses.'
    );
    router.replace('/forgot-password');
    return;
  }

  if (password.value.length < 8)
    return toast.error('Password minimal 8 karakter.');
  if (password.value !== confirmPassword.value)
    return toast.error('Konfirmasi password tidak cocok.');

  loading.value = true;
  try {
    // PERBAIKAN: Melewatkan PIN sebagai token otorisasi ke fungsi resetPassword
    // Asumsi: auth.resetPassword(newPassword, verificationToken)
    await auth.resetPassword({
      pin: verifiedPin.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    });

    // Hapus PIN dari localStorage setelah berhasil direset
    localStorage.removeItem('verifiedPin');

    toast.success('Password berhasil direset!');
    router.push('/login');
  } catch (e) {
    console.error(e);
    toast.error(
      e.response?.data?.message ||
        'Gagal mereset password. Token otorisasi mungkin kedaluwarsa.'
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- FULL-VIEWPORT MOBILE CONTAINER -->
  <div class="flex justify-center min-h-screen bg-gray-50">
    <div
      class="flex flex-col w-full max-w-md min-h-screen text-gray-800 bg-white"
    >
      <!-- HEADER (Back Button) -->
      <div class="flex items-center px-4 pt-6">
        <button @click="router.back()" class="text-xl text-teal-600">
          <!-- ChevronLeft icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 class="flex-1 text-lg font-bold text-center text-teal-700">
          Reset Password
        </h1>
        <div class="w-6"></div>
        <!-- Spacer -->
      </div>

      <!-- CONTENT -->
      <div class="flex flex-col flex-1 p-6 sm:p-8">
        <div
          class="flex flex-col items-center justify-center p-6 bg-white rounded-2xl"
        >
          <!-- ILLUSTRATION/ICON (Lock) -->
          <div class="p-3 mb-6 bg-teal-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-teal-600"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 class="mb-2 text-2xl font-extrabold text-center text-gray-900">
            Atur Ulang Kata Sandi
          </h2>
          <p class="mb-8 text-sm text-center text-gray-600">
            Hampir selesai! Masukkan kata sandi baru untuk akun Anda.
          </p>

          <form @submit.prevent="handleReset" class="w-full space-y-5">
            <!-- New Password Input with Toggle -->
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password baru (Min. 8 karakter)"
                required
                :disabled="!verifiedPin || loading"
                class="w-full px-4 py-3 pr-12 transition-all duration-200 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500"
              />
              <button
                type="button"
                @click="togglePassword('password')"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal-600"
                :disabled="!verifiedPin || loading"
              >
                <!-- Eye or EyeOff icon -->
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eye"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eye-off"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  />
                  <path
                    d="M6.61 6.61A13.14 13.14 0 0 0 2 12s3 7 10 7a9.88 9.88 0 0 0 2.52-.38"
                  />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              </button>
            </div>

            <!-- Confirm Password Input with Toggle -->
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Konfirmasi password"
                required
                :disabled="!verifiedPin || loading"
                class="w-full px-4 py-3 pr-12 transition-all duration-200 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500"
              />
              <button
                type="button"
                @click="togglePassword('confirm')"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal-600"
                :disabled="!verifiedPin || loading"
              >
                <!-- Eye or EyeOff icon -->
                <svg
                  v-if="showConfirmPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eye"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eye-off"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  />
                  <path
                    d="M6.61 6.61A13.14 13.14 0 0 0 2 12s3 7 10 7a9.88 9.88 0 0 0 2.52-.38"
                  />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              </button>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !verifiedPin"
              class="flex items-center justify-center w-full py-3 font-semibold text-white transition-all duration-300 bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 disabled:opacity-50 disabled:shadow-none"
            >
              <span v-if="loading">
                <!-- Loader2 icon (inline SVG) -->

                Menyimpan...
              </span>
              <span v-else> Simpan Password </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
