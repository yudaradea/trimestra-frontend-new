<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
// Asumsi: useAuthStore menyediakan 'email', 'cooldown', 'verifyPin', dan 'resendPin'
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
const toast = useToast();

const store = useAuthStore();
const router = useRouter();

// --- Configuration ---
const NUM_DIGITS = 6;
const INITIAL_TIMER_SECONDS = 600; // 10 menit

// --- State Management ---
const pinDigits = ref(Array(NUM_DIGITS).fill(''));
const timeLeft = ref(INITIAL_TIMER_SECONDS);
const loading = ref(false);
const message = ref(null); // { type: 'success'|'error', text: string }

// Refs untuk kontrol fokus input. PENTING: Menggantikan document.querySelectorAll
const inputRefs = ref([]);
let timerInterval = null;

// --- Computed Properties ---
const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
});

const isPinComplete = computed(() =>
  pinDigits.value.every((digit) => digit !== '' && /^\d$/.test(digit))
);
const fullPin = computed(() => pinDigits.value.join(''));
const isExpired = computed(() => timeLeft.value === 0);

// --- Timer Logic ---
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

onMounted(() => {
  // Validasi: Pastikan email ada di store, jika tidak arahkan kembali
  if (!store.email) {
    toast.warning('Silakan isi email terlebih dahulu.');
    router.replace('/forgot-password');
    return;
  }

  //   --- PERBAIKAN: Hapus token dari localStorage saat view dimuat, untuk menghindari penggunaan PIN lama ---
  localStorage.removeItem('verifiedPin');
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

// --- Input Handlers (Menggunakan inputRefs) ---
const handleInput = (index, event) => {
  const value = event.target.value.replace(/\D/g, ''); // Hanya izinkan digit

  if (value.length > 0) {
    pinDigits.value[index] = value.charAt(0);

    // Pindah fokus ke input berikutnya
    if (index < NUM_DIGITS - 1) {
      inputRefs.value[index + 1]?.focus();
    }
  } else {
    // Jika input dikosongkan secara manual, pastikan state diperbarui
    pinDigits.value[index] = '';
  }
};

const handleBackspace = (index, event) => {
  // Jika field saat ini kosong, pindah ke belakang dan hapus digit sebelumnya
  if (pinDigits.value[index] === '' && index > 0) {
    inputRefs.value[index - 1]?.focus();
    pinDigits.value[index - 1] = ''; // Kosongkan digit sebelumnya
    event.preventDefault(); // Mencegah aksi backspace default pada field yang sudah kosong
  } else if (pinDigits.value[index] !== '') {
    // Jika field saat ini berisi, hapus isinya
    pinDigits.value[index] = '';
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const pasteData = event.clipboardData
    .getData('Text')
    .replace(/\D/g, '')
    .slice(0, NUM_DIGITS);

  if (pasteData) {
    const newDigits = Array(NUM_DIGITS).fill('');
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    pinDigits.value = newDigits;

    // Fokus pada field kosong berikutnya atau field terakhir
    const nextFocusIndex = Math.min(pasteData.length, NUM_DIGITS - 1);
    inputRefs.value[nextFocusIndex]?.focus();
  }
};

// --- Action Handlers (Menggunakan state 'message' untuk feedback) ---

const verify = async () => {
  message.value = null;
  if (isExpired.value) {
    message.value = {
      type: 'error',
      text: 'Kode PIN sudah kedaluwarsa. Silakan kirim ulang.',
    };
    toast.error('Kode PIN sudah kedaluwarsa. Silakan kirim ulang.');
    return;
  }
  if (!isPinComplete.value) {
    message.value = { type: 'error', text: 'PIN harus 6 digit.' };
    return;
  }

  loading.value = true;
  try {
    await store.verifyPin(fullPin.value);

    // Success
    localStorage.setItem('verifiedPin', fullPin.value); // simpan sementara
    message.value = {
      type: 'success',
      text: 'Verifikasi berhasil! Mengarahkan...',
    };
    toast.success('Verifikasi PIN berhasil!');
    clearInterval(timerInterval); // Hentikan timer SECARA EKSPLISIT

    // Tunda sebentar untuk UX sebelum navigasi
    setTimeout(() => {
      router.push('/reset-password');
    }, 500);
  } catch (e) {
    // Error
    loading.value = false;
    pinDigits.value = Array(NUM_DIGITS).fill(''); // Kosongkan input
    inputRefs.value[0]?.focus();
    const errorText =
      e.response?.data?.message ||
      'Terjadi kesalahan saat verifikasi PIN. Silakan coba lagi.';
    message.value = { type: 'error', text: errorText };
    toast.error(errorText);
  }
  // Set loading ke false hanya jika tidak langsung navigasi
  if (message.value?.type !== 'success') {
    loading.value = false;
  }
};

const resend = async () => {
  if (store.cooldown > 0) return;

  loading.value = true;
  message.value = null;

  try {
    await store.resendPin();

    // --- PERBAIKAN: Hapus token dari localStorage saat resend, karena PIN lama sudah invalid di server ---
    localStorage.removeItem('verifiedPin');

    // Reset timer dan input pada resend yang sukses
    timeLeft.value = INITIAL_TIMER_SECONDS;
    pinDigits.value = Array(NUM_DIGITS).fill('');
    startTimer(); // Mulai ulang timer

    message.value = { type: 'success', text: 'PIN baru telah dikirim!' };
    toast.success('PIN baru telah dikirim ke email Anda.');
    inputRefs.value[0]?.focus();

    // Tambahkan timeout untuk menghapus pesan sukses resend setelah beberapa saat
    setTimeout(() => {
      if (
        message.value?.type === 'success' &&
        message.value?.text === 'PIN baru telah dikirim!'
      ) {
        message.value = null;
      }
    }, 3000);
  } catch (e) {
    const errorText = e.response?.data?.message || 'Gagal mengirim ulang PIN.';
    message.value = { type: 'error', text: errorText };
  }
  loading.value = false;
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
          Verifikasi PIN
        </h1>
        <div class="w-6"></div>
        <!-- Spacer -->
      </div>

      <!-- CONTENT -->
      <div class="flex flex-col flex-1 p-6 sm:p-8">
        <div
          class="flex flex-col items-center justify-center p-6 bg-white rounded-2xl"
        >
          <!-- ILLUSTRATION/ICON (Shield) -->
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M12 18v-6l-3-2"></path>
            </svg>
          </div>

          <h2 class="mb-2 text-2xl font-extrabold text-center text-gray-900">
            Verifikasi Kode
          </h2>
          <p class="mb-8 text-sm text-center text-gray-600">
            Masukkan **6 digit PIN** yang telah kami kirim ke: <br />
            <span class="font-semibold text-teal-700">{{ store.email }}</span>
          </p>

          <!-- Feedback Message -->
          <p
            v-if="message"
            :class="[
              'mb-4 text-sm font-medium',
              {
                'text-red-600': message.type === 'error',
                'text-teal-600': message.type === 'success',
              },
            ]"
          >
            {{ message.text }}
          </p>

          <!-- Input PIN -->
          <div class="flex justify-center gap-2 mb-6" @paste="handlePaste">
            <!-- Menggunakan pinDigits sebagai array loop, dan ref binding -->
            <input
              v-for="(digit, index) in pinDigits"
              :key="index"
              :ref="(el) => (inputRefs[index] = el)"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :value="digit"
              :disabled="isExpired || loading"
              @input="handleInput(index, $event)"
              @keydown.backspace="handleBackspace(index, $event)"
              :class="[
                'w-10 h-14 text-xl font-bold text-center border-2 rounded-xl transition-all duration-200',
                {
                  'border-red-400 bg-red-50': isExpired,
                  'border-gray-300': !isExpired,
                  'border-teal-500': digit !== '' && !isExpired,
                  'focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-teal-500':
                    !isExpired,
                  'disabled:opacity-70 disabled:bg-gray-100': true,
                },
              ]"
            />
          </div>

          <!-- Timer -->
          <div class="mb-6 text-sm text-center text-gray-600">
            <p v-if="isExpired" class="font-semibold text-red-600">
              Kode PIN sudah kedaluwarsa.
            </p>
            <p v-else>
              PIN akan kedaluwarsa dalam
              <span class="ml-1 font-extrabold text-teal-600">
                {{ formattedTime }}
              </span>
            </p>
          </div>

          <!-- Verification Button -->
          <button
            @click="verify"
            :disabled="loading || !isPinComplete || isExpired"
            class="flex items-center justify-center w-full py-3 font-semibold text-white transition-all duration-300 bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 disabled:opacity-50 disabled:shadow-none"
          >
            <span v-if="loading"> Memverifikasi... </span>
            <span v-else> Verifikasi </span>
          </button>

          <!-- Resend Link -->
          <div class="mt-6 text-center">
            <span class="text-sm text-gray-500"> Belum menerima kode? </span>
            <button
              @click="resend"
              :disabled="store.cooldown > 0 || loading"
              class="ml-2 font-bold text-teal-600 transition-colors duration-300 disabled:text-gray-400 hover:text-teal-700"
            >
              Kirim Ulang PIN
              <!-- Menggunakan store.cooldown untuk menampilkan timer di UI -->
              <span
                v-if="store.cooldown > 0"
                class="ml-1 font-extrabold text-teal-600"
                >({{ store.cooldown }}s)</span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
