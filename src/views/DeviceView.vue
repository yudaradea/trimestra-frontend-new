<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <Header title="Aktivitas" showBack />

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center min-h-[80vh] py-12"
    >
      <div class="text-5xl animate-spin">⏳</div>
    </div>

    <!-- Belum tertaut -->
    <div
      v-else-if="!linked"
      class="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 text-center"
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
    <div v-else class="px-4 py-6">
      <div
        class="flex items-center gap-4 p-4 mb-6 border rounded-lg shadow-sm bg-gray-50"
      >
        <img src="../assets/device-smart.png" alt="Watch" class="w-12 h-12" />
        <div>
          <p class="text-sm text-gray-500">Device Terhubung</p>
          <p class="font-semibold text-gray-800">{{ device.device_name }}</p>
          <p class="text-xs text-gray-500">Kode: {{ device.device_code }}</p>
        </div>
      </div>

      <h3 class="mb-3 text-base font-semibold text-gray-700">
        Mulai Aktivitas
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="act in activities"
          :key="act"
          @click="startActivity(act)"
          class="flex items-center justify-center py-3 text-sm font-medium text-white transition-transform transform rounded-lg shadow-md bg-primary hover:bg-primary/80 hover:scale-105"
        >
          {{ act }}
        </button>
      </div>

      <!-- Riwayat -->
      <div class="mt-8">
        <h3 class="mb-3 text-base font-semibold text-gray-700">
          Riwayat Aktivitas
        </h3>
        <div
          v-if="!history.length"
          class="p-4 text-sm text-center text-gray-500 border-2 border-dashed rounded-lg"
        >
          Belum ada aktivitas tercatat
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="item in history"
            :key="item.id"
            class="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
          >
            <div>
              <p class="text-sm font-semibold text-gray-800">
                {{ item.activity }}
              </p>
              <p class="text-xs text-gray-500">
                {{ item.duration_minutes }} menit •
                {{ formatDate(item.started_at) }}
              </p>
            </div>
            <p class="text-sm font-semibold text-primary">
              🔥 {{ item.calories_burned }} kal
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Scanner -->
    <Modal :show="showScanner" @close="closeScanner">
      <template #title>Scan Barcode Device</template>
      <div id="reader" class="w-full"></div>
    </Modal>
  </div>
  <BottomNav />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import axios from '@/lib/axios';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import { Html5Qrcode } from 'html5-qrcode';
import { nextTick } from 'vue';
import Modal from '@/components/Modal.vue';

const toast = useToast();

const loading = ref(true);
const linked = ref(false);
const device = ref(null);
const deviceCode = ref('');
const activities = ['Jogging', 'Sepeda', 'Jalan Kaki', 'Cardio'];
const history = ref([]);
const showScanner = ref(false);
let scanner = null;

const userId = useAuthStore().user.id;

async function checkStatus() {
  loading.value = true;
  try {
    const res = await axios.get('/device/status');
    linked.value = res.data.linked;
    device.value = res.data.device ?? null;
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Gagal memuat status device');
    linked.value = false;
    device.value = null;
  } finally {
    loading.value = false;
  }
}

async function linkDevice() {
  try {
    await axios.post('/device/link', {
      user_id: userId,
      device_code: deviceCode.value,
    });
    toast.success('Device berhasil ditautkan');
    await checkStatus();
    deviceCode.value = '';
    closeScanner();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menautkan device');
  }
}

async function startScanner() {
  await nextTick();
  scanner = new Html5Qrcode('reader');
  scanner
    .start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        linkDevice(decodedText);
      },
      (errorMessage) => {
        // ignore scan errors
      }
    )
    .catch(() => {
      toast.error('Tidak bisa mengakses kamera');
    });
}

async function closeScanner() {
  if (scanner) {
    try {
      // hanya stop kalau sedang running
      await scanner.stop();
      await scanner.clear();
    } catch (e) {
      console.warn('Scanner sudah berhenti:', e.message);
    } finally {
      scanner = null;
    }
  }
  showScanner.value = false;
}

function startActivity(activity) {
  console.log(`Mulai aktivitas: ${activity}`);
}

function formatDate(date) {
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

watch(showScanner, (newVal) => {
  if (newVal) {
    startScanner();
  } else {
    closeScanner();
  }
});

onMounted(checkStatus);
onBeforeUnmount(closeScanner);
</script>
