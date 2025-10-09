<template>
  <div class="max-w-md pt-2 mx-auto bg-white">
    <div class="flex items-center justify-between max-w-md px-4 mx-auto">
      <div class="flex items-center py-3 bg-white">
        <button v-if="showBack" @click="goBack" class="mr-2 text-gray-600">
          <i class="text-xl ri-arrow-left-line"></i>
        </button>
        <h1 class="text-lg font-semibold text-gray-700">{{ title }}</h1>
      </div>

      <!-- Tombol Notifikasi dengan Badge -->
      <router-link to="/notifications" class="relative">
        <i class="text-2xl text-teal-600 ri-notification-3-line"></i>
        <span
          v-if="notifStore.unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5"
        >
          {{ notifStore.unreadCount }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notificationStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  title: String,
  showBack: { type: Boolean, default: false },
});

const router = useRouter();
const goBack = () => router.back();

const notifStore = useNotificationStore();

onMounted(() => {
  notifStore.fetchUnreadCount();
});
</script>
