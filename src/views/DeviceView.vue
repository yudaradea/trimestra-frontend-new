<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <Header title="Aktivitas" showBack />

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-screen py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat data...</span>
    </div>

    <!-- Belum tertaut -->
    <div
      v-else-if="!linked"
      class="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center"
    >
      <img
        src="../assets/device-smart.png"
        alt="Device"
        class="w-32 h-32 mb-6"
      />
      <h2 class="mb-2 text-xl font-bold text-gray-800">Device Belum Tertaut</h2>
      <p class="mb-8 text-sm text-gray-600">
        Hubungkan smartwatch ESP kamu untuk mulai mencatat aktivitas dan kalori
        terbakar.
      </p>

      <!-- Scan barcode -->
      <div class="w-full mb-6">
        <button
          @click="showScanner = true"
          type="button"
          class="flex flex-col items-center justify-center w-full p-6 transition-all duration-300 border-2 border-dashed rounded-xl text-primary border-primary/50 hover:border-primary hover:bg-primary/10 aspect-video"
        >
          <span class="text-6xl">📸</span>
          <span class="mt-2 text-sm font-medium text-primary"
            >Scan Barcode Device</span
          >
        </button>
      </div>

      <!-- Input manual -->
      <p class="mb-4 text-xs text-gray-500">
        Atau masukkan kode device secara manual:
      </p>
      <div class="w-full">
        <input
          v-model="deviceCode"
          type="text"
          placeholder="Masukkan kode device"
          class="input"
        />
        <button
          @click="linkDevice"
          class="w-full py-2 mt-4 text-white rounded-lg bg-primary hover:bg-primary/80"
        >
          Tautkan Device
        </button>
      </div>
    </div>

    <!-- Sudah tertaut -->
    <div v-else class="px-4 py-6 space-y-6">
      <!-- Device info -->
      <div
        class="flex items-center gap-4 p-4 mb-2 border rounded-lg shadow-sm bg-gray-50"
      >
        <img src="../assets/device-smart.png" alt="Watch" class="w-12 h-12" />
        <div>
          <p class="text-sm text-gray-500">Device Terhubung</p>
          <p class="font-semibold text-gray-800">{{ device?.device_name }}</p>
          <p class="text-xs text-gray-500">Kode: {{ device?.device_code }}</p>
        </div>
      </div>

      <!-- Tombol Unlink -->
      <button
        @click="showUnlinkModal = true"
        class="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
      >
        Putuskan Tautan Device
      </button>

      <!-- Input aktivitas + timer -->
      <h3 class="mt-2 mb-3 text-base font-semibold text-gray-700">
        Mulai Aktivitas
      </h3>
      <input
        v-model="activityName"
        type="text"
        placeholder="Contoh: Jogging sore, Push up, Yoga"
        class="w-full mb-4 input"
      />
      <div class="flex items-center justify-between mb-6">
        <div class="text-lg font-bold text-gray-800">
          ⏱ {{ formattedTimer }}
        </div>
        <div class="flex gap-2">
          <button
            v-if="!isRunning"
            @click="startActivity"
            class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Start
          </button>
          <button
            v-else
            @click="stopActivity"
            class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Stop
          </button>
        </div>
      </div>

      <!-- Riwayat aktivitas -->
      <div class="mt-2">
        <h3 class="mb-3 text-base font-semibold text-gray-700">
          Riwayat Aktivitas
        </h3>

        <!-- Navigasi tanggal (like diary) -->
        <div class="flex items-center justify-between mb-3">
          <button
            @click="goPrevDay"
            class="px-3 py-1 text-sm bg-gray-100 rounded-lg"
          >
            ← {{ prevLabel }}
          </button>
          <span class="font-medium">{{ formattedSelectedDate }}</span>
          <button
            @click="goNextDay"
            class="px-3 py-1 text-sm bg-gray-100 rounded-lg"
            :disabled="isSelectedToday"
          >
            {{ nextLabel }} →
          </button>
        </div>

        <div
          v-if="dayItems.length === 0"
          class="p-4 text-sm text-center text-gray-500 border-2 border-dashed rounded-lg"
        >
          Belum ada aktivitas untuk hari ini
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="item in dayItems"
            :key="item.id"
            class="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
          >
            <div>
              <p class="text-sm font-semibold text-gray-800">
                {{ item.activity_name }}
              </p>
              <p class="text-xs text-gray-500">
                Durasi {{ formatDuration(item.duration, item.seconds) }}
              </p>
              <p class="text-xs text-gray-500">
                Pukul {{ formatRange(item.created_at, item.duration) }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-sm font-semibold text-primary">
                🔥 {{ item.calories_burned }} kal
              </p>
              <button
                @click="confirmDelete(item)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="text-xl ri-delete-bin-line"></i>
              </button>
            </div>
          </div>

          <!-- Load more (append items for the selected day only) -->
          <div class="flex justify-center mt-4">
            <button
              v-if="hasMoreDay"
              @click="loadMoreDay()"
              class="px-4 py-2 text-sm text-white rounded bg-primary hover:bg-primary/80"
            >
              Muat lebih banyak
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Scanner -->
    <Modal :show="showScanner" @close="closeScanner">
      <template #title>Scan Barcode Device</template>
      <div id="reader" class="w-full"></div>
    </Modal>

    <!-- Modal Unlink -->
    <Modal :show="showUnlinkModal" @close="showUnlinkModal = false">
      <template #title>Konfirmasi Unlink</template>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Masukkan password akun Anda untuk mengkonfirmasi pelepasan device.
        </p>
        <input
          v-model="unlinkPassword"
          type="password"
          placeholder="Password"
          class="w-full input"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="showUnlinkModal = false"
            class="px-4 py-2 text-white bg-gray-400 rounded"
          >
            Batal
          </button>
          <button
            @click="unlinkDevice"
            class="px-4 py-2 text-white bg-red-500 rounded"
          >
            Unlink
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal Hapus Exercise -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <template #title>Konfirmasi Hapus</template>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Yakin ingin menghapus aktivitas
          <b>{{ selectedItem?.activity_name }}</b
          >?
        </p>
        <div class="flex justify-end gap-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-white bg-gray-400 rounded"
          >
            Batal
          </button>
          <button
            @click="deleteExercise"
            class="px-4 py-2 text-white bg-red-500 rounded"
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  </div>
  <BottomNav />
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from 'vue';
import axios from '@/lib/axios';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import Modal from '@/components/Modal.vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import { Html5Qrcode } from 'html5-qrcode';

const toast = useToast();

// Device/auth state
const loading = ref(true);
const linked = ref(false);
const device = ref(null);
const deviceCode = ref('');
const { user } = useAuthStore();
const userId = user?.id;

// Scanner modal
const showScanner = ref(false);
let scanner = null;

// Unlink modal
const showUnlinkModal = ref(false);
const unlinkPassword = ref('');

// Activity input/timer
const activityName = ref('');
const isRunning = ref(false);
const timer = ref(0);
let timerInterval = null;

// Per-day logs state
const logsByDay = ref({}); // { 'YYYY-MM-DD': ExerciseLog[] }
const dayPageMap = ref({}); // { 'YYYY-MM-DD': number }
const perPage = 10;

// Selected date (for day navigation like Diary)
const selectedDate = ref(new Date());

// Delete modal
const showDeleteModal = ref(false);
const selectedItem = ref(null);

// ================= Computed =================

const formattedTimer = computed(() => {
  const m = Math.floor(timer.value / 60);
  const s = timer.value % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const selectedDateKey = computed(() => formatISODate(selectedDate.value));

const formattedSelectedDate = computed(() =>
  new Date(selectedDate.value).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
);

const prevLabel = computed(() =>
  new Date(addDays(selectedDate.value, -1)).toLocaleDateString('id-ID', {
    weekday: 'long',
  })
);

const nextLabel = computed(() =>
  new Date(addDays(selectedDate.value, 1)).toLocaleDateString('id-ID', {
    weekday: 'long',
  })
);

const isSelectedToday = computed(
  () => formatISODate(selectedDate.value) === formatISODate(new Date())
);

const dayItems = computed(() => logsByDay.value[selectedDateKey.value] || []);

const hasMoreDay = computed(() => {
  // Show "Load more" if current day items length is a multiple of perPage and not empty
  const len = dayItems.value.length;
  return len > 0 && len % perPage === 0;
});

// ================= Device status =================

async function checkStatus() {
  loading.value = true;
  try {
    const res = await axios.get('/device/status');
    linked.value = !!res.data.linked;
    device.value = res.data.device ?? null;

    if (linked.value) {
      // init today view
      selectedDate.value = new Date();
      const key = selectedDateKey.value;
      logsByDay.value[key] = [];
      dayPageMap.value[key] = 1;
      await fetchHistoryForDay(key, 1);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal memuat status device');
    linked.value = false;
    device.value = null;
  } finally {
    loading.value = false;
  }
}

// ================= Day navigation =================

function goPrevDay() {
  selectedDate.value = addDays(selectedDate.value, -1);
  const key = selectedDateKey.value;
  logsByDay.value[key] = []; // reset day list
  dayPageMap.value[key] = 1; // reset page
  fetchHistoryForDay(key, 1);
}

function goNextDay() {
  if (isSelectedToday.value) return;
  selectedDate.value = addDays(selectedDate.value, 1);
  const key = selectedDateKey.value;
  logsByDay.value[key] = [];
  dayPageMap.value[key] = 1;
  fetchHistoryForDay(key, 1);
}

function loadMoreDay() {
  const key = selectedDateKey.value;
  const nextPage = (dayPageMap.value[key] ?? 1) + 1;
  dayPageMap.value[key] = nextPage;
  fetchHistoryForDay(key, nextPage);
}

// ================= Fetch logs (per day) =================

async function fetchHistoryForDay(dayKey, page) {
  try {
    const res = await axios.get('/exercise-logs/activity', {
      params: { per_page: perPage, page, date: dayKey },
    });
    const data = res.data?.data || [];
    // Append only items belonging to requested day (defensive client-side filter)
    const filtered = data.filter(
      (it) =>
        (it.created_at || it.date || '').toString().slice(0, 10) === dayKey
    );
    logsByDay.value[dayKey].push(...filtered);

    // If fewer than perPage returned, likely no more for this day
    if (data.length < perPage) {
      // Keep page as is; hasMoreDay will turn false automatically
      dayPageMap.value[dayKey] = page;
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message || 'Gagal memuat riwayat aktivitas'
    );
  }
}

// ================= Activity timer =================

function startActivity() {
  if (!activityName.value) {
    toast.error('Isi nama aktivitas terlebih dahulu');
    return;
  }
  isRunning.value = true;
  timer.value = 0;
  toast.success('Aktivitas dimulai');
  timerInterval = setInterval(() => {
    timer.value++;
  }, 1000);
}

async function stopActivity() {
  if (!isRunning.value) return;
  clearInterval(timerInterval);
  isRunning.value = false;

  const totalSeconds = timer.value;
  // Bulatkan ke atas dan paksa minimal 1 menit
  let durationMinutes = Math.ceil(totalSeconds / 60);
  if (durationMinutes < 1) durationMinutes = 1;

  const caloriesBurned = Math.floor(Math.random() * 50) + 20;

  // Kirim tanggal dengan format MySQL (Y-m-d H:i:s)
  const now = new Date();
  const mysqlNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')} ${String(
    now.getHours()
  ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
    now.getSeconds()
  ).padStart(2, '0')}`;

  try {
    await axios.post('/exercise-logs/device', {
      activity_name: activityName.value,
      duration: durationMinutes,
      calories_burned: caloriesBurned,
      date: mysqlNow, // simpan sebagai DATETIME
      from_device: true,
    });
    toast.success('Aktivitas berhasil dicatat');
    activityName.value = '';

    // Refresh hari ini
    const todayKey = formatISODate(new Date());
    logsByDay.value[todayKey] = [];
    dayPageMap.value[todayKey] = 1;
    selectedDate.value = new Date(todayKey);
    await fetchHistoryForDay(todayKey, 1);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menyimpan aktivitas');
  }
}

// ================= Delete =================

function confirmDelete(item) {
  selectedItem.value = item;
  showDeleteModal.value = true;
}

async function deleteExercise() {
  if (!selectedItem.value) return;
  try {
    await axios.delete(`/exercise-log/${selectedItem.value.id}`);
    const key = selectedDateKey.value;
    logsByDay.value[key] = (logsByDay.value[key] || []).filter(
      (h) => h.id !== selectedItem.value.id
    );
    showDeleteModal.value = false;
    selectedItem.value = null;
    toast.success('Aktivitas dihapus');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menghapus aktivitas');
  }
}

// ================= Scanner (QR) =================

async function startScanner() {
  await nextTick();
  scanner = new Html5Qrcode('reader');
  scanner
    .start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => linkDevice(decodedText),
      () => {}
    )
    .catch(() => toast.error('Tidak bisa mengakses kamera'));
}

async function closeScanner() {
  if (scanner) {
    try {
      await scanner.stop();
      await scanner.clear();
    } catch {}
    scanner = null;
  }
  showScanner.value = false;
}

watch(showScanner, (val) => {
  if (val) startScanner();
  else closeScanner();
});

// ================= Link/unlink device =================

async function linkDevice(code = null) {
  try {
    await axios.post('/device/link', {
      user_id: userId,
      device_code: code || deviceCode.value,
    });
    toast.success('Device berhasil ditautkan');
    await checkStatus();
    deviceCode.value = '';
    closeScanner();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menautkan device');
  }
}

async function unlinkDevice() {
  if (!device.value) return;
  try {
    await axios.post(`/device/${device.value.id}/unlink`, {
      password: unlinkPassword.value,
    });
    toast.success('Device berhasil di-unlink');
    linked.value = false;
    device.value = null;
    unlinkPassword.value = '';
    showUnlinkModal.value = false;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal unlink device');
  }
}

// ================= Helpers =================

function formatISODate(d) {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return dateObj.toISOString().slice(0, 10);
}

function addDays(d, delta) {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  const next = new Date(dateObj);
  next.setDate(next.getDate() + delta);
  return next;
}

function formatRange(createdAt, durationMinutes) {
  if (!createdAt || !durationMinutes) return '-';

  const end = new Date(createdAt); // waktu selesai
  const start = new Date(end.getTime() - durationMinutes * 60 * 1000); // mundur sesuai durasi

  const startStr = start.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endStr = end.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${startStr} – ${endStr}`;
}

function formatTime(dateStr) {
  if (!dateStr) return '-';
  const dt = new Date(dateStr); // ISO string → otomatis ke local time
  return dt.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const totalSeconds = timer.value;
let durationMinutes = Math.round(totalSeconds / 60);
if (durationMinutes < 1) durationMinutes = 1;

function formatDuration(minutes) {
  // minutes sudah bulat, minimal 1
  if (minutes < 60) return `${minutes} menit`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} jam ${m} menit` : `${h} jam`;
}

function formatDateHeader(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ================= Lifecycle =================

onMounted(checkStatus);

onBeforeUnmount(() => {
  closeScanner();
  if (timerInterval) clearInterval(timerInterval);
});
</script>
