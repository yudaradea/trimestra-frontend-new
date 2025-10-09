<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <Header title="Notifikasi" showBack />

    <!-- Loading Spinner -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-[90vh] py-12"
    >
      <div class="text-4xl animate-spin">⏳</div>
    </div>

    <div class="p-4">
      <!-- Jika belum ada notifikasi -->
      <div
        v-if="grouped.length === 0 && !loading"
        class="text-sm text-gray-500"
      >
        Belum ada notifikasi
      </div>

      <!-- Daftar Notifikasi -->
      <div v-for="group in grouped" :key="group.date" class="mb-6">
        <h3 class="mb-2 text-sm font-semibold text-gray-500">
          {{ formatDate(group.date) }}
        </h3>
        <div class="space-y-2">
          <NotificationItem
            v-for="notif in group.items"
            :key="notif.id"
            :notif="notif"
            @deleted="handleDelete"
          />
        </div>
      </div>

      <!-- Tombol Load More -->
      <div v-if="hasMore && !loading" class="mt-6 text-center">
        <button
          @click="loadMore"
          class="px-4 py-2 text-sm font-semibold text-teal-600 border border-teal-600 rounded"
        >
          Load More
        </button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/lib/axios';
import NotificationItem from '@/components/NotificationItem.vue';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { useNotificationStore } from '@/stores/notificationStore';

const notifStore = useNotificationStore();

const notifications = ref([]);
const loading = ref(true);
const page = ref(1);
const limit = 10;
const hasMore = ref(true);

onMounted(() => loadNotifications());

async function loadNotifications() {
  loading.value = true;
  try {
    const response = await axios.get('/notifications', {
      params: { page: page.value, limit },
    });

    const newData = response.data.data;
    const total = response.data.total;

    if (
      newData.length < limit ||
      notifications.value.length + newData.length >= total
    ) {
      hasMore.value = false;
    }

    notifications.value.push(...newData);
    notifStore.fetchUnreadCount();
  } catch (error) {
    console.error('Gagal ambil notifikasi:', error);
  } finally {
    loading.value = false;
  }
}

function loadMore() {
  page.value++;
  loadNotifications();
}

function handleDelete(id) {
  notifications.value = notifications.value.filter((n) => n.id !== id);
}

const grouped = computed(() => {
  const groups = {};
  notifications.value.forEach((n) => {
    const date = n.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(n);
  });
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
});

function formatDate(date) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (date === today) return 'Hari Ini';
  if (date === yesterday) return 'Kemarin';

  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
</script>
