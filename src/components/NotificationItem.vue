<template>
  <div ref="itemRef" class="relative rounded animate-fade-in">
    <!-- Tombol Hapus -->
    <div
      v-if="showDelete"
      class="absolute top-0 bottom-0 right-0 z-10 flex items-center justify-center text-sm font-semibold text-white bg-red-500 cursor-pointer w-14"
      @click.stop="handleDelete"
    >
      Hapus
    </div>

    <!-- Konten Notifikasi -->
    <div
      class="flex items-start gap-3 p-3 transition-transform duration-300 rounded-lg"
      :style="{ transform: showDelete ? 'translateX(-56px)' : 'translateX(0)' }"
      @click="handleRead"
      v-touch:swipe.left="onSwipeLeft"
      v-touch:swipe.right="onSwipeRight"
      :class="[
        isRead
          ? 'bg-gray-100 text-gray-500 font-light'
          : 'bg-primary text-white shadow-lg hover:shadow-2xl cursor-pointer',
      ]"
    >
      <i :class="`text-xl ${notif.icon}`"></i>
      <div class="flex-1">
        <h4 class="font-medium">{{ notif.title }}</h4>
        <p v-if="notif.message" class="text-sm">{{ notif.message }}</p>
        <div class="mt-1 text-xs">{{ formatTime(notif.time) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from '@/lib/axios';
import { useNotificationStore } from '@/stores/notificationStore';
import { useToast } from 'vue-toastification';

const props = defineProps({ notif: Object });
const emit = defineEmits(['deleted']);

const notifStore = useNotificationStore();

const showDelete = ref(false);
const isRead = ref(props.notif.read);
const itemRef = ref(null);

let swipeTimeout;

// 🟦 Swipe kiri → tampilkan tombol hapus
function onSwipeLeft() {
  clearTimeout(swipeTimeout);
  swipeTimeout = setTimeout(() => (showDelete.value = true), 50);
}

// 🟩 Swipe kanan → sembunyikan tombol hapus
function onSwipeRight() {
  clearTimeout(swipeTimeout);
  swipeTimeout = setTimeout(() => (showDelete.value = false), 50);
}

function formatTime(time) {
  if (!time) return '';
  // potong format "HH:MM:SS" menjadi "HH:MM"
  return time.slice(0, 5);
}

// 🟧 Klik di luar → sembunyikan tombol hapus
function handleClickOutside(event) {
  if (
    showDelete.value &&
    itemRef.value &&
    !itemRef.value.contains(event.target)
  ) {
    showDelete.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

async function handleRead() {
  if (!isRead.value && !showDelete.value) {
    // hanya tandai dibaca kalau tombol hapus tidak sedang muncul
    isRead.value = true;
    try {
      await axios.patch(`/notifications/${props.notif.id}/read`);
      notifStore.decrementUnread();
    } catch (e) {
      console.error('Gagal tandai sebagai dibaca:', e);
    }
  }
}

async function handleDelete() {
  try {
    await axios.delete(`/notifications/${props.notif.id}`);
    emit('deleted', props.notif.id);
    useToast().success('Notifikasi berhasil dihapus');
  } catch (e) {
    console.error('Gagal hapus notifikasi:', e);
    useToast().error('Gagal hapus notifikasi');
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
